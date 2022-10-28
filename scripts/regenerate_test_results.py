import os
import sys

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)
from nlp import generate_interactions_matrix  # noqa: E402

INPUT_DIRECTORY = 'tests/books/'
OUTPUT_DIRECTORY = 'tests/matrices/'

for filename in os.listdir(INPUT_DIRECTORY):
    with open(os.path.join(INPUT_DIRECTORY, filename), "r") as f:
        text = f.read()
    generate_interactions_matrix(
        text,
        OUTPUT_DIRECTORY +
        filename.split('.')[0] +
        ".output")
