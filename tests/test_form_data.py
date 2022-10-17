import json
import os
from .constants import OK_RESPONSE_CODE
import pytest



def test_submit_data(client):
    directory = 'tests/books'

    for filename in os.listdir(directory):
        book = json.load(open(os.path.join(directory, filename), "r"))
        response = client.post('/', data=book, follow_redirects=True)
        assert response.status_code == OK_RESPONSE_CODE
        assert book['title'].encode() in response.data
        assert book['text'].encode() in response.data
