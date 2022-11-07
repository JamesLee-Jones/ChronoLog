import pytest
import os
import nlp

TEXT_DIRECTORY = 'tests/books/'
CSV_DIRECTORY = 'tests/matrices/'

files = [filename.split('.')[0] for filename in os.listdir(TEXT_DIRECTORY)]


@pytest.mark.parametrize('test_name', files)
def test_interactions_matrix(test_name):
    with open(os.path.join(TEXT_DIRECTORY, test_name + '.txt'), 'r') as f:
        text = f.read()
    nlp.generate_interactions_matrix(text, 'temp')
    with open('temp.csv', 'r') as a:
        actual = a.read()
    with open(os.path.join(CSV_DIRECTORY, test_name + '.output.csv')) as e:
        expected = e.read()
    assert actual == expected
    os.remove('temp.csv')