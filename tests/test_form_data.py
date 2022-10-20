import json
import os
from .constants import OK_RESPONSE_CODE

DIRECTORY = 'tests/books'


def test_submit_data(client):
    for filename in os.listdir(DIRECTORY):
        book = json.load(open(os.path.join(DIRECTORY, filename), "r"))
        response = client.post('/', data=book, follow_redirects=True)
        assert response.status_code == OK_RESPONSE_CODE
        assert book['title'].encode() in response.data
