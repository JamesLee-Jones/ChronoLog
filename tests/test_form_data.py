import os
from .constants import OK_RESPONSE_CODE

DIRECTORY = 'tests/books'


def test_submit_data(client):
    for filename in os.listdir(DIRECTORY):
        book = open(os.path.join(DIRECTORY, filename), "r").read()
        response = client.post(
            '/',
            data={
                'title': filename,
                'text': book},
            follow_redirects=True)
        assert response.status_code == OK_RESPONSE_CODE
        assert filename.encode() in response.data
