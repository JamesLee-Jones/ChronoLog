from .constants import OK_RESPONSE_CODE
import pytest


def test_submit_data(client):
    response = client.get('/')
    assert response.status_code == OK_RESPONSE_CODE
    assert b"Input a Book!" in response.data
