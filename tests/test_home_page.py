import pytest


def test_submit_data(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"Input a Book!" in response.data
