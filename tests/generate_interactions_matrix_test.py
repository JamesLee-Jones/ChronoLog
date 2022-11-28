import numpy as np
import pytest
import os
from backend import nlp, character_interactions_processor as cip

TEXT_DIRECTORY = 'tests/books/'
CSV_DIRECTORY = 'tests/matrices/'

files = [filename.split('.')[0] for filename in os.listdir(TEXT_DIRECTORY)]


@pytest.mark.parametrize('test_name', files)
def test_interactions_matrix(test_name):
    with open(os.path.join(TEXT_DIRECTORY, test_name + '.txt'), 'r') as f:
        text = f.read()
    actual = cip.normalise_matrix(nlp.InteractionsCounter().generate_interactions_matrix(text)[0])
    expected = np.loadtxt(
        os.path.join(
            CSV_DIRECTORY,
            test_name +
            '.output.csv'),
        delimiter=',')
    assert np.allclose(actual, expected)
