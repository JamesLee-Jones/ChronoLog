import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./App.css";
import "./Library.css";

function Library() {
  useEffect(() => {
    document.body.style.backgroundColor = "#eae0d5";
  });

  const [bookTitles, setBookTitles] = useState([]);
  // const [loading, setLoading] = useState(true)

  let filePaths = require.context("../public/library/", false, /\.json$/);
  filePaths = filePaths.keys();

  let newTitles = [];

  function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function parseJSON(response) {
    return response.json();
  }

  useEffect(() => {
    Promise.all(
      filePaths.map((fp) =>
        fetch(fp)
          .then(checkStatus)
          .then(parseJSON)
          .catch((error) => console.log("There was a problem", error))
      )
    ).then((data) => {
      console.log("Post Promise.all", data);
      newTitles = [];
      data.forEach((d1) => {
        newTitles.push(d1["book"]);
      });
      setBookTitles(newTitles);
    });
  }, []);

  return (
    <div className="books">
      <Row xs={1} md={2} lg={4} className="g-4">
        {bookTitles.map((bookTitle, index) => (
          <Col>
            <Card className="text-center">
              <Card.Img variant="top" src="../ChronoLogoMini.png" />
              <Card.Body>
                <Card.Title>{bookTitle}</Card.Title>
                <a href={filePaths[index].slice(2, -5)} className="btn stretched-link">
                  View graph
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Library;
