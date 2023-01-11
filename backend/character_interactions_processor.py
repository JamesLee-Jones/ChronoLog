import json
import jsbeautifier
import numpy as np
import string
import networkx as nx

import backend.nlp as nlp

JSON_DIRECTORY = "timelines/"


class CharacterInteractionsProcessor:

    def __init__(self, chapter_regex: str, nb_sections: int, percentile: int, narrator: str, quiet: bool, pruned: bool,
                 author: str):
        self.pruned = pruned
        self.quiet = quiet
        self.narrator = narrator
        self.percentile = percentile
        self.nb_sections = nb_sections
        self.chapter_regex = chapter_regex
        self.author = author

        self.sections = []
        self.unnormalised_matrices = []
        self.normalised_matrices = []
        self.characters_timeline = []
        self.metadata = {}

    def preprocess_text(self, text: str):
        if self.chapter_regex:
            if not self.quiet:
                print("Splitting book into chapters...")
            timeline = list(self.chapter_regex.split(text))
            timeline.pop(0)
            self.nb_sections = len(timeline)
        else:
            # Splits by paragraph, then joins paragraphs back up into NUM_SPLITS
            # sections
            if not self.quiet:
                print("Splitting book into {0} sections...".format(self.nb_sections))
            paragraphs = text.split("\n")
            num_sections = min(self.nb_sections, len(paragraphs))
            k, m = divmod(len(paragraphs), self.nb_sections)
            # This combines paragraphs into NUM_SPLIT sections and then restores
            # the paragraph structure
            timeline = ["\n".join(paragraphs[i * k + min(i,
                                                         m): (i + 1) * k + min(i + 1,
                                                                               m)]) for i in range(num_sections)]
            filter(lambda ps: ("".join(ps).strip() != ""), timeline)
        if not self.quiet:
            print("Cleaning text...")
        for segment in timeline:
            segment = segment.rstrip()
            segment = segment.replace("\n", " ")
            segment = segment.replace("\r", " ")
            self.sections.append(segment)
        if not self.quiet:
            print("Finished cleaning and splitting text...")

    def _calculate_threshold(self, values: np.ndarray) -> float:
        values = values[values > 0]
        return np.percentile(values, self.percentile)

    def prune(self):
        if not self.quiet:
            print("Pruning timeline matrices...")
        characters_interactions = {
            ch: self.unnormalised_matrices[-1][:, self.characters_timeline[-1].index(ch)].sum()
            for ch in self.characters_timeline[-1]
        }
        threshold = self._calculate_threshold(np.fromiter(characters_interactions.values(), dtype=int))
        if not self.quiet:
            print("Threshold: ", threshold)
        unimportant_characters = [ch for (ch, x) in characters_interactions.items() if x <= threshold]

        self._prune_matrices(unimportant_characters)
        interactions_overall, interactions_per_character = self._prune_metadata(unimportant_characters)

        return interactions_overall, interactions_per_character

    def _prune_matrices(self, unimportant_characters: list[str]):
        for i in range(len(self.unnormalised_matrices)):
            for character in [ch for ch in self.characters_timeline[i] if ch in unimportant_characters]:
                j = self.characters_timeline[i].index(character)
                self.unnormalised_matrices[i] = np.delete(
                    np.delete(self.unnormalised_matrices[i], j, axis=0),
                    j, axis=1
                )
                self.characters_timeline[i].pop(j)

    def sort_matrix(self, i, d_centrality):
        matrix = np.array(self.normalised_matrices[i])
        np_chars = np.array(self.characters_timeline[i])
        d_c = np.array([d_centrality[char] for char in self.characters_timeline[i]])
        indices = np.argsort(-d_c)
        ordered_matrix = matrix[:, indices]
        ordered_matrix = ordered_matrix[indices, :]
        ordered_characters = np_chars[indices]
        self.normalised_matrices[i] = ordered_matrix
        self.characters_timeline[i] = list(ordered_characters)

    def _prune_metadata(self, unimportant_characters: list[str]):
        interactions_overall = self.metadata["first interactions overall"]
        interactions_per_character = self.metadata["first interactions per char"]
        for uc in unimportant_characters:
            if uc in interactions_overall:
                del interactions_overall[uc]
            if uc in interactions_per_character:
                del interactions_per_character[uc]
            for key in list(interactions_per_character.keys()):
                if uc in interactions_per_character[key]:
                    del interactions_per_character[key][uc]
                    if not interactions_per_character[key]:
                        del interactions_per_character[key]
        return interactions_overall, interactions_per_character

    def update_per_char_metadata(self, mg):
        curr_metadata = "first interactions per char"
        for (name, value) in self.metadata[curr_metadata].copy().items():
            replace_name = False
            for new_name in mg.character_dict[name]:
                if new_name != name:
                    replace_name = True
                    self.metadata[curr_metadata][new_name] = self.metadata[curr_metadata][name]
                for (name2, interaction) in value.copy().items():
                    replace_name_2 = False
                    for new_name2 in mg.character_dict[name2]:
                        if new_name2 != name2 and name2 in self.metadata[curr_metadata][new_name]:
                            replace_name_2 = True
                            self.metadata[curr_metadata][new_name][new_name2] = self.metadata[curr_metadata][new_name][
                                name2]
                    if replace_name_2:
                        self.metadata[curr_metadata][new_name].pop(name2)
            if replace_name:
                self.metadata[curr_metadata].pop(name)

    def update_overall_metadata(self, mg):
        curr_metadata = "first interactions overall"
        for (name, interaction) in self.metadata[curr_metadata].copy().items():
            replace_name = False
            for new_name in mg.character_dict[name]:
                if new_name != name:
                    replace_name = True
                    self.metadata[curr_metadata][new_name] = self.metadata[curr_metadata][name]
                int_with = self.metadata[curr_metadata][new_name]["with"]
                for int_with_fname in mg.character_dict[int_with]:
                    self.metadata[curr_metadata][new_name]["with"] = int_with_fname
            if replace_name:
                self.metadata[curr_metadata].pop(name)

    def update_names_metadata(self, mg):
        self.update_per_char_metadata(mg)
        self.update_overall_metadata(mg)

    @staticmethod
    def normalise_matrix(matrix: np.ndarray):
        DECIMAL_PLACES = 5
        for i in range(len(matrix)):
            row_sum = sum(matrix[i])
            for j in range(len(matrix[i])):
                matrix[i][j] = (matrix[i][j] / row_sum) if row_sum != 0 else 0
        return np.round(matrix, decimals=DECIMAL_PLACES)

    @staticmethod
    def network_analysis(matrix, character_list):
        ROUND_TO = 4
        scale_factor = 10
        G = nx.Graph()
        for i in range(len(character_list)):
            G.add_node(character_list[i])
        for j in range(len(character_list) - 1):
            for k in range(j, len(character_list)):
                w = matrix[k][j] + matrix[j][k]
                if not w == 0:
                    G.add_edge(character_list[j], character_list[k], weight=w * scale_factor)

        graph = G
        avg_clusterings = []

        # The most important character and how many characters they are connected to
        # degree centrality - the number of connections a node has to another node
        d_centrality = nx.degree_centrality(graph)
        d_centrality_rounded = {key: round(d_centrality[key], ROUND_TO) for key in d_centrality}
        centrality_values = d_centrality_rounded.values()
        most_important_node = sorted(list(d_centrality.items()), key=lambda v: v[1])[-1][0]
        degree_of_node = graph.degree(most_important_node)
        centrality_of_node = d_centrality_rounded[most_important_node]
        avg_centrality = 0 if len(centrality_values) == 0 else np.round(
            sum(centrality_values) / len(centrality_values), ROUND_TO)

        # Individual statistics for characters:
        # betweeness centrality - how much these nodes connect other nodes
        # katz centrality - computes the relative influence of a node within a network by
        # measuring the number of the immediate neighbors (first degree nodes)

        # degree centrality - the number of connections a node has to another node
        # get the connected components of G

        # select the largest connected component
        # largest_component = max(connected_components, key=len)

        b_centrality = nx.betweenness_centrality(graph, weight="weight")
        b_centrality_rounded = {key: round(b_centrality[key], ROUND_TO) for key in b_centrality}
        s_centrality = nx.subgraph_centrality(graph)
        s_centrality_rounded = {key: round(s_centrality[key], ROUND_TO) for key in s_centrality}

        # normalize subgraph_centrality
        min_val = min(s_centrality_rounded.values())
        max_val = max(s_centrality_rounded.values())
        range_val = max_val - min_val
        for key in s_centrality_rounded:
            s_centrality_rounded[key] = (s_centrality_rounded[key] - min_val) / range_val
        s_c_r = s_centrality_rounded
        b_c_r = b_centrality_rounded
        d_c_r = d_centrality_rounded

        # The clique involving that character and it's size
        # The number of cliques
        number_of_cliques = 0
        for C in (graph.subgraph(c).copy() for c in nx.connected_components(graph)):
            if not nx.is_empty(C):
                number_of_cliques += 1
                avg_clusterings.append(nx.average_clustering(C, weight="weight"))

        clustering_average = 0 if len(avg_clusterings) == 0 else np.round(sum(avg_clusterings) / len(avg_clusterings),
                                                                          ROUND_TO)
        mc_stats = (most_important_node, degree_of_node, centrality_of_node)

        return clustering_average, number_of_cliques, mc_stats, avg_centrality, s_c_r, b_c_r, d_c_r

    def generate_timeline_json(self, title: str):
        file_path = JSON_DIRECTORY + "{}_analysis.json".format(title.replace(' ', '_'))
        json_contents = {"book": string.capwords(title.replace('_', ' ')),
                         "author": self.author.title(),
                         "num_sections": self.nb_sections,
                         "sections": []
                         }

        matrix_generator = nlp.InteractionsCounter(self.narrator)
        for (i, section) in enumerate(self.sections):
            if not self.quiet:
                print("Analysing section {} of {}...".format(i + 1, self.nb_sections))
            interactions, characters = matrix_generator(section)
            self.unnormalised_matrices.append(interactions)
            self.characters_timeline.append(characters)
        self.metadata = matrix_generator.get_metadata()

        if self.pruned:
            self.prune()
        self.normalised_matrices = list(map(self.normalise_matrix, self.unnormalised_matrices))
        for i in range(len(self.characters_timeline)):
            for j in range(len(self.characters_timeline[i])):
                self.characters_timeline[i][j] = max(matrix_generator.character_dict[self.characters_timeline[i][j]],
                                                     key=len) if matrix_generator.character_dict[
                    self.characters_timeline[i][j]] else self.characters_timeline[i][j]
            analysis = self.network_analysis(self.normalised_matrices[i], self.characters_timeline[i])
            self.sort_matrix(i, analysis[6])
            json_contents["sections"].append({
                "names": self.characters_timeline[i],
                "matrix": self.normalised_matrices[i].tolist(),
                "graph_attributes": {
                    "average_clustering": analysis[0],
                    "no_of_cliques": analysis[1],
                    "most_important_character": analysis[2][0],
                    "degree_of_mic": analysis[2][1],
                    "degree_centrality_mic": analysis[2][2],
                    "avg_degree_centrality": analysis[3],
                    "subgraph_centrality": analysis[4],
                    "betweenness_centrality": analysis[5],
                    "degree_centrality": analysis[6],
                }
            })
        self.update_names_metadata(matrix_generator)
        json_contents["first_interactions_between_characters"] = self.metadata["first interactions per char"]
        json_contents["first_interactions_overall"] = self.metadata["first interactions overall"]
        with open(file_path, "w", newline='\r\n') as f:
            opts = jsbeautifier.default_options()
            opts.indent_size = 2
            f.write(jsbeautifier.beautify(json.dumps(json_contents), opts))
        if not self.quiet:
            print("Done! Analysis saved at {}.".format(file_path))

    def process(self, title: str, text: str):
        self.preprocess_text(text)
        self.generate_timeline_json(title)
