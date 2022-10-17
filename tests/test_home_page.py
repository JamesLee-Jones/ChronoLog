import pytest


def test_submit_data(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"<h1>Input a Book! - NLP Character Timeline Generator</h1>"
