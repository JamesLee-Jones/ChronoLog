import os
import sys
import numpy as np
import pandas as pd
from .gendermodel import preprocess as pp
from keras.models import load_model
import spacy
import regex as re

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)
gender_predictor = load_model(os.path.join(parent, 'backend/gendermodel/boyorgirl.h5'))


class InteractionsCounter:

    def __init__(self, narrator: str = None):
        self.prev_matrix: np.ndarray = np.zeros((1, 1))
        self.prev_characters: list[str] = []
        self.character_dict: dict[str, str] = {} if not narrator else {"I": narrator}
        self.first_interactions_overall: dict = {}
        self.first_interactions_per_char: dict = {}

        self.first_person: bool = narrator is not None
        self.character_genders: dict[str, str] = {}
        self.pronouns: dict[str, str] = {'I': narrator, 'female': '', 'male': ''}

    def _get_characters(self, doc) -> list[str]:
        all_characters = sorted(
            set(self.prev_characters +
                [ent.text.title().replace("_", "").removesuffix("'S") for ent in doc.ents if ent.label_ == "PERSON"]))
        return sorted(self._pool_characters(all_characters))

    def _setup_interactions(self, characters: list[str]) -> dict[str, dict[str, float]]:
        interactions = {character: {character2: 0.0 for character2 in characters}
                        for character in characters}
        for i in range(len(self.prev_characters)):
            for j in range(i + 1, len(self.prev_characters)):
                char1, char2 = self.prev_characters[i], self.prev_characters[j]
                interactions[self.character_dict[char1]][self.character_dict[char2]] = self.prev_matrix[i][j]
                interactions[self.character_dict[char2]][self.character_dict[char1]] = self.prev_matrix[j][i]
        return interactions

    def _pool_characters(self, all_characters: list[str]) -> list[str]:
        character_matches = {ch: [ch2 for ch2 in all_characters if ch in re.split(" |-", ch2)] for ch in all_characters}
        for name in character_matches:
            full_name = str(max(character_matches[name], key=len)) if character_matches[name] else name
            self.character_dict[name] = full_name

        return self._predict_genders(list(set(self.character_dict.values())))

    def _predict_genders(self, characters) -> list[str]:
        pred_df = pd.DataFrame({'name': characters})
        pred_df = pp.preprocess(pred_df, train=False)
        # Predictions
        result = gender_predictor.predict(np.asarray(pred_df['name'].values.tolist())).squeeze(axis=1)
        pred_df['Boy or Girl?'] = [
            'Boy' if logit > 0.5 else 'Girl' for logit in result
        ]
        pred_df['Probability'] = [
            logit if logit > 0.5 else 1.0 - logit for logit in result
        ]
        pred_df['name'] = characters
        self.character_genders = {
            char: pred_df.at[pred_df.index[pred_df['name'] == char].tolist()[0], 'Boy or Girl?']
            for char in characters
        }
        return characters

    def _match_pronouns(self, pronouns, characters):
        more_chars = []
        for p in pronouns:
            if self.first_person and p == 'I':
                more_chars.append(self.pronouns['I'])
            elif p == 'she' or p == 'her':
                more_chars.append(self.pronouns['female'])
            elif p == 'he' or p == 'him':
                more_chars.append(self.pronouns['male'])

        for char in characters:
            gender = self.character_genders[char]
            if gender == 'Girl':
                self.pronouns['female'] = char
            elif gender == 'Boy':
                self.pronouns['male'] = char

        all_chars = set(characters).union(set(more_chars).difference(''))
        return list(all_chars) if more_chars else characters

    def _update_interactions_records(self, interactions: dict, sentence: str, first_char: str, second_char: str):
        # If first char not in dict, add to dict
        if self.first_interactions_per_char.get(first_char) is None:
            self.first_interactions_per_char[first_char] = {}
        # If they have not interacted before
        if self.first_interactions_per_char.get(first_char).get(second_char) is None:
            self.first_interactions_per_char[first_char].update({second_char: sentence})
        # If this is their first overall interaction
        if not sum(interactions[first_char].values()):
            self.first_interactions_overall[first_char] = {"with": second_char, "context": sentence}
        if second_char in interactions and not sum(interactions[second_char].values()):
            self.first_interactions_overall[second_char] = {"with": first_char, "context": sentence}

    def generate_interactions_matrix(self, text: str) -> tuple[np.ndarray, list[str]]:
        try:
            nlp = spacy.load("en_core_web_lg")
        except OSError:
            spacy.cli.download("en_core_web_lg")
            nlp = spacy.load("en_core_web_lg")

        doc = nlp(text)
        characters = self._get_characters(doc)
        interactions = self._setup_interactions(characters)

        for sentence in doc.sents:
            people = list(dict.fromkeys(
                [ent.text.title().replace("_", "").removesuffix("'S") for ent in sentence.ents if
                 ent.label_ == "PERSON"]))
            pronouns = list(set([pn.text.lower() for pn in sentence if pn.pos_ == "PRON"]))
            people = self._match_pronouns(pronouns, people)
            for i in range(len(people)):
                for j in range(i + 1, len(people)):
                    # Track first interactions
                    first_char = min(self.character_dict[people[i]], self.character_dict[people[j]])
                    second_char = max(self.character_dict[people[i]], self.character_dict[people[j]])
                    if first_char == second_char:
                        continue
                    self._update_interactions_records(interactions, sentence.text, first_char, second_char)
                    # Increment interactions
                    interactions[first_char][second_char] += 1
                    interactions[second_char][first_char] += 1

        interactions_matrix = np.zeros((len(characters), len(characters)))

        for (i, char_interactions) in enumerate(interactions.values()):
            for (j, num_interactions) in enumerate(char_interactions.values()):
                interactions_matrix[i][j] = num_interactions
        self.prev_matrix = interactions_matrix
        self.prev_characters = characters
        return interactions_matrix, characters

    def __call__(self, text: str) -> tuple[np.ndarray, list[str]]:
        return self.generate_interactions_matrix(text)

    def get_metadata(self) -> dict:
        return {
            "first interactions overall": dict.copy(self.first_interactions_overall),
            "first interactions per char": dict.copy(self.first_interactions_per_char)
        }
