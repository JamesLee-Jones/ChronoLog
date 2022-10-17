from app import app


def test_submit_data():
    client = app.test_client()
    response = client.post('/', data={"title": "Test", "text": "This is a test input."}, follow_redirects=True)
    assert response.status_code == 200
    assert b"<h1> Results for Test </h1>" in response.data
    assert b"<p> This is a test input. </p>" in response.data
    response = client.post('/', data={"title": "Lorem ipsum",
                                      "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do "
                                              "eiusmod tempor incididunt ut labore et dolore magna aliqua."},
                           follow_redirects=True)
    assert response.status_code == 200
    assert b"<h1> Results for Lorem ipsum </h1>" in response.data
    assert b"<p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore " \
           b"et dolore magna aliqua. </p>" in response.data
