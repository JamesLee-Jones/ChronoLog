import os
import sys

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)
from ChronologBackend.nlp import generate_interactions_matrix  # noqa: E402

INPUT_DIRECTORY = 'tests/books/'
OUTPUT_DIRECTORY = 'tests/matrices/'

if len(sys.argv) != 2:
    raise Exception("Please pass a file to test.")

filename = sys.argv[1]
with open(os.path.join(INPUT_DIRECTORY, filename), "r") as f:
    text = f.read()
generate_interactions_matrix(
    text,
    OUTPUT_DIRECTORY +
    filename.split('.')[0] +
    ".output")
