import json
import os
import pytest


def test_submit_data(client):
    directory = 'tests/books'

    for filename in os.listdir(directory):
        book = json.load(open(os.path.join(directory, filename), "r"))
        response = client.post('/', data=book, follow_redirects=True)
        assert response.status_code == 200
        assert book['title'].encode() in response.data
        assert book['text'].encode() in response.data
