import numpy as np
import spacy
import json

JSON_DIRECTORY = "timelines/"


def process_data(text, chapter_regex, num_splits, quiet):
    """
    :param text: The full text to be analysed.
    :param chapter_regex: Regex by which chapters are determined. If chapter_regex=="", split into equal length sections.
    :param quiet: Flag to silence print statements
    :return: Returns list of sections
    """
    if not num_splits:
        num_splits = 10
    if chapter_regex:
        if not quiet:
            print("Splitting book into chapters...")
        timeline = list(
            filter(
                lambda x: not (
                    x.strip() is None),
                chapter_regex.split(text)))
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


def generate_interactions_matrix(text, prev_matrix, prev_characters):
    try:
        nlp = spacy.load("en_core_web_lg")
    except OSError:
        spacy.cli.download("en_core_web_lg")
        nlp = spacy.load("en_core_web_lg")

    doc = nlp(text)

    characters = sorted(
        set(prev_characters + [ent.text for ent in doc.ents if ent.label_ == "PERSON"]))
    interactions = {character: {character2: 0.0 for character2 in characters}
                    for character in characters}

    for i in range(len(prev_characters)):
        for j in range(i + 1, len(prev_characters)):
            char1, char2 = prev_characters[i], prev_characters[j]
            interactions[char1][char2] = prev_matrix[i][j]
            interactions[char2][char1] = prev_matrix[j][i]
    for sentence in doc.sents:
        people = list(dict.fromkeys(
            [ent.text for ent in sentence.ents if ent.label_ == "PERSON"]))
        for i in range(len(people)):
            for j in range(i + 1, len(people)):
                interactions[people[i]][people[j]] += 1
                interactions[people[j]][people[i]] += 1

    interactions_matrix = np.zeros((len(characters), len(characters)))
    norm_interactions_matrix = np.zeros((len(characters), len(characters)))

    for (i, char_interactions) in enumerate(interactions.values()):
        row_sum = sum(char_interactions.values())
        for (j, num_interactions) in enumerate(char_interactions.values()):
            interactions_matrix[i][j] = num_interactions
            norm_interactions_matrix[i][j] = num_interactions / \
                row_sum if row_sum != 0 else 0
    return norm_interactions_matrix, interactions_matrix, characters


def generate_timeline_json(sections, title, quiet):
    interactions = []
    characters = []
    file_path = JSON_DIRECTORY + "{}_analysis.json".format(title)
    json_contents = {"book": title,
                     "num_sections": len(sections),
                     "sections": []
                     }
    for (i, section) in enumerate(sections):
        if not quiet:
            print("Analysing section {} of {}...".format(i + 1, len(sections)))
        normalised_interactions, interactions, characters = generate_interactions_matrix(
            section, interactions, characters)
        json_contents["sections"].append({
            "names": characters,
            "matrix": normalised_interactions.tolist()
        })
    with open(file_path, "w", newline='\r\n') as f:
        f.write(json.dumps(json_contents, indent=2))
    if not quiet:
        print("Done! Analysis saved at {}.".format(file_path))
