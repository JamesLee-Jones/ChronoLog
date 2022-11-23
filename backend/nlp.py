import numpy as np
import spacy
import regex as re
import json

JSON_DIRECTORY = "timelines/"


def process_data(text, chapter_regex, num_splits, quiet):
    """
    :param text: The full text to be analysed.
    :param chapter_regex: Regex by which chapters are determined. If chapter_regex="", split into equal length sections.
    :param num_splits: The number of sections to split the text into if regex is not given
    :param quiet: Flag to silence print statements
    :return: Returns list of sections
    """

    if chapter_regex:
        if not quiet:
            print("Splitting book into chapters...")
        timeline = list(chapter_regex.split(text))
        timeline.pop(0)
    else:
        # Splits by paragraph, then joins paragraphs back up into NUM_SPLITS
        # sections
        if not quiet:
            print("Splitting book into {0} sections...".format(num_splits))
        paragraphs = text.split("\n")
        num_sections = min(num_splits, len(paragraphs))
        k, m = divmod(len(paragraphs), num_splits)
        # This combines paragraphs into NUM_SPLIT sections and then restores
        # the paragraph structure
        timeline = ["\n".join(paragraphs[i * k + min(i,
                                                     m): (i + 1) * k + min(i + 1,
                                                                           m)]) for i in range(num_sections)]
        filter(lambda ps: ("".join(ps).strip() != ""), timeline)
    cleaned_data = []
    if not quiet:
        print("Cleaning text...")
    for segment in timeline:
        segment = segment.rstrip()
        segment = segment.replace("\n", " ")
        segment = segment.replace("\r", " ")
        cleaned_data.append(segment)
    if not quiet:
        print("Finished cleaning and splitting text...")
    return cleaned_data


def pool_characters(all_characters: list[str], character_dict: dict[str, str]) -> list[str]:
    character_matches = {ch: [ch2 for ch2 in all_characters if ch in re.split(" |-", ch2)] for ch in all_characters}
    full_names = set()
    for name in character_matches:
        full_name = str(max(character_matches[name], key=len)) if character_matches[name] else name
        character_dict[name] = full_name
        full_names.add(full_name)

    return list(full_names)


def get_characters(doc, prev_characters, character_dict):
    all_characters = sorted(
        set(prev_characters +
            [ent.text.title().replace("_", "").removesuffix("'S") for ent in doc.ents if ent.label_ == "PERSON"]))
    return sorted(pool_characters(all_characters, character_dict))


def setup_interactions(characters, prev_characters, character_dict, prev_matrix):
    interactions = {character: {character2: 0.0 for character2 in characters}
                    for character in characters}
    for i in range(len(prev_characters)):
        for j in range(i + 1, len(prev_characters)):
            char1, char2 = prev_characters[i], prev_characters[j]
            interactions[character_dict[char1]][character_dict[char2]] = prev_matrix[i][j]
            interactions[character_dict[char2]][character_dict[char1]] = prev_matrix[j][i]
    return interactions


def generate_interactions_matrix(text, prev_matrix, prev_characters, character_dict, first_interactions_overall={},
                                 first_interactions_per_char={}):
    try:
        nlp = spacy.load("en_core_web_lg")
    except OSError:
        spacy.cli.download("en_core_web_lg")
        nlp = spacy.load("en_core_web_lg")

    doc = nlp(text)
    characters = get_characters(doc, prev_characters, character_dict)
    interactions = setup_interactions(characters, prev_characters, character_dict, prev_matrix)

    for sentence in doc.sents:
        people = list(dict.fromkeys(
            [ent.text.title().replace("_", "").removesuffix("'S") for ent in sentence.ents if ent.label_ == "PERSON"]))
        for i in range(len(people)):
            for j in range(i + 1, len(people)):
                # Track first interactions
                first_char = min(character_dict[people[i]], character_dict[people[j]])
                second_char = max(character_dict[people[i]], character_dict[people[j]])
                if first_char == second_char:
                    continue
                update_interactions_records(first_interactions_per_char, first_interactions_overall, interactions,
                                            sentence.text, first_char, second_char)
                # Increment interactions
                interactions[first_char][second_char] += 1
                interactions[second_char][first_char] += 1

    interactions_matrix = np.zeros((len(characters), len(characters)))

    for (i, char_interactions) in enumerate(interactions.values()):
        for (j, num_interactions) in enumerate(char_interactions.values()):
            interactions_matrix[i][j] = num_interactions
    return interactions_matrix, characters


def update_interactions_records(first_interactions_per_char, first_interactions_overall, interactions, sentence,
                                first_char, second_char):
    if first_interactions_per_char.get(first_char) is None:
        first_interactions_per_char[first_char] = {}
    if first_interactions_per_char.get(first_char).get(second_char) is None:
        first_interactions_per_char[first_char].update({second_char: sentence})
    if not sum(interactions[first_char].values()):
        first_interactions_overall[first_char] = {"with": second_char, "context": sentence}
    if not sum(interactions[second_char].values()):
        first_interactions_overall[second_char] = {"with": first_char, "context": sentence}


def normalise_matrix(matrix):
    for i in range(len(matrix)):
        row_sum = sum(matrix[i])
        for j in range(len(matrix[i])):
            matrix[i][j] = (matrix[i][j] / row_sum) if row_sum != 0 else 0
    return matrix


def calculate_threshold(values, percentile):
    values = values[values > 0]
    return np.percentile(values, percentile)


def prune_matrices(matrices, characters_timeline, quiet, percentile, interactions_overall, interactions_per_character):
    if not quiet:
        print("Pruning timeline matrices...")
    characters_interactions = {
        ch: matrices[-1][:, characters_timeline[-1].index(ch)].sum() for ch in characters_timeline[-1]
    }
    threshold = calculate_threshold(np.fromiter(characters_interactions.values(), dtype=int), percentile)
    if not quiet:
        print("Threshold: ", threshold)
    unimportant_characters = [ch for (ch, x) in characters_interactions.items() if x < threshold]

    for i in range(len(matrices)):
        for character in [ch for ch in characters_timeline[i] if ch in unimportant_characters]:
            j = characters_timeline[i].index(character)
            matrices[i] = np.delete(np.delete(matrices[i], j, axis=0), j, axis=1)
            characters_timeline[i].pop(j)

    for c in unimportant_characters:
        if c in interactions_overall:
            del interactions_overall[c]
        if c in interactions_per_character:
            del interactions_per_character[c]
        for key in list(interactions_per_character.keys()):
            if c in interactions_per_character[key]:
                del interactions_per_character[key][c]
            if not interactions_per_character[key]:
                del interactions_per_character[key]

    return matrices, characters_timeline, interactions_overall, interactions_per_character


def generate_timeline_json(sections, title, quiet, unpruned, percentile):
    interactions = []
    characters = []
    file_path = JSON_DIRECTORY + "{}_analysis.json".format(title.replace(' ', '_'))
    json_contents = {"book": title,
                     "num_sections": len(sections),
                     "sections": []
                     }

    unnormalised_matrices = []
    character_lists = []
    first_interactions_overall = {}
    first_interactions_per_char = {}
    for (i, section) in enumerate(sections):
        if not quiet:
            print("Analysing section {} of {}...".format(i + 1, len(sections)))
        interactions, characters = generate_interactions_matrix(
            section, interactions, characters, {}, first_interactions_overall, first_interactions_per_char)
        unnormalised_matrices.append(interactions)
        character_lists.append(characters)
    if not unpruned:
        unnormalised_matrices, character_lists, first_interactions_overall, first_interactions_per_char = \
            prune_matrices(unnormalised_matrices, character_lists, quiet, percentile, first_interactions_overall,
                           first_interactions_per_char)
    normalised_matrices = list(map(normalise_matrix, unnormalised_matrices))
    for i in range(len(character_lists)):
        json_contents["sections"].append({
            "names": character_lists[i],
            "matrix": normalised_matrices[i].tolist()
        })
    json_contents["first_interactions_between_characters"] = first_interactions_per_char
    json_contents["first_interactions_overall"] = first_interactions_overall
    with open(file_path, "w", newline='\r\n') as f:
        f.write(json.dumps(json_contents, indent=2))
    if not quiet:
        print("Done! Analysis saved at {}.".format(file_path))
