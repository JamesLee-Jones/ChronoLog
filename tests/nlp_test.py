import pytest
import nlp
import os
import json

DIRECTORY = 'tests/books'

def test_nlp_result():
    for filename in os.listdir(DIRECTORY):
        book = json.load(open(os.path.join(DIRECTORY, filename), "r"))
        assert nlp.extract_characters(book['text']) == book['expected']
