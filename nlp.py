import spacy
import spacy_transformers


def process_data(text):
    segments = text.split("\n\n")
    cleaned_data = []
    for segment in segments:
        segment = segment.rstrip()
        segment = segment.replace("\n", " ")
        segment = segment.replace("\r", " ")
        cleaned_data.append(segment)

    return cleaned_data


def extract_charcaters(text):

    try:
        nlp = spacy.load("en_core_web_md")
    except:
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
