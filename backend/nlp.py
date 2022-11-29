import numpy as np
import spacy
import regex as re


class InteractionsCounter:

    def __init__(self, narrator: str = None):
        self.prev_matrix: np.ndarray = np.zeros((1, 1))
        self.prev_characters: list[str] = []
        self.character_dict: dict[str, str] = {} if not narrator else {"I": narrator}
        self.first_interactions_overall: dict = {}
        self.first_interactions_per_char: dict = {}
        self.first_person: bool = narrator is not None

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
        full_names = set()
        for name in character_matches:
            full_name = str(max(character_matches[name], key=len)) if character_matches[name] else name
            self.character_dict[name] = full_name
            full_names.add(full_name)

        return list(full_names)

    def _update_interactions_records(self, interactions: dict, sentence: str, first_char: str, second_char: str):
        if self.first_interactions_per_char.get(first_char) is None:
            self.first_interactions_per_char[first_char] = {}
        if self.first_interactions_per_char.get(first_char).get(second_char) is None:
            self.first_interactions_per_char[first_char].update({second_char: sentence})
        if not sum(interactions[first_char].values()):
            self.first_interactions_overall[first_char] = {"with": second_char, "context": sentence}
        if not sum(interactions[second_char].values()):
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
            pronouns = list(set([pn.text.title() for pn in sentence if pn.pos_ == "PRON" and pn.text == "I"]))
            if self.first_person:
                people.extend(pronouns)
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