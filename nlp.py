import numpy as np
import spacy


def process_data(text):
    segments = text.split("\n\n")
    cleaned_data = []
    for segment in segments:
        segment = segment.rstrip()
        segment = segment.replace("\n", " ")
        segment = segment.replace("\r", " ")
        cleaned_data.append(segment)

    return cleaned_data


def extract_characters(text):
    try:
        nlp = spacy.load("en_core_web_md")
    except OSError:
        spacy.cli.download("en_core_web_md")
        nlp = spacy.load("en_core_web_md")

    data = process_data(text)
    people = {}

    for item in data:
        doc = nlp(item)
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                if ent.text in people:
                    people[ent.text] += 1
                else:
                    people[ent.text] = 1

    return people


def generate_interactions_matrix(text, filename):
    try:
        nlp = spacy.load("en_core_web_md")
    except OSError:
        spacy.cli.download("en_core_web_md")
        nlp = spacy.load("en_core_web_md")

    doc = nlp(text)

    characters = list(dict.fromkeys([ent.text for ent in doc.ents if ent.label_ == "PERSON"]))
    interactions = {character: {character2: 0 for character2 in characters} for character in characters}

    for sentence in doc.sents:
        people = list(dict.fromkeys([ent.text for ent in sentence.ents if ent.label_ == "PERSON"]))
        for i in range(len(people)):
            for j in range(i + 1, len(people)):
                interactions[people[i]][people[j]] += 1
                interactions[people[j]][people[i]] += 1

    interactions_matrix = np.zeros((len(characters), len(characters)))

    for (i, char_interactions) in enumerate(interactions.values()):
        row_sum = sum(char_interactions.values())
        for (j, num_interactions) in enumerate(char_interactions.values()):
            interactions_matrix[i][j] = num_interactions / row_sum if row_sum != 0 else 0

    character_header = ', '.join(characters)
    np.savetxt(filename + ".csv", interactions_matrix, delimiter=",", fmt="%.5f", header=character_header)

    return interactions_matrix
