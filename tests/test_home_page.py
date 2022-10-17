from app import app


def test_submit_data():
    client = app.test_client()
    response = client.post('/')
    assert b"<h1>Input a Book! - NLP Character Timeline Generator</h1>"
