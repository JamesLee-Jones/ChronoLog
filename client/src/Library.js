import React, { useEffect } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./App.css";
import "./Library.css";

function Library() {
  useEffect(() => {
    document.body.style.backgroundColor = "#eae0d5";
  });

  let files = require.context("../public/timelines/", false, /\.json$/);
  files = files.keys().map((filename) => filename.slice(2, -5));
  files = files.map((filename) => filename.replaceAll("_", " "))

  return (
    <div className="books">
      <Row xs={1} md={2} lg={4} className="g-4">
        {files.map((filename) => (
          <Col>
            <Card>
              <Card.Img variant="top" src="holder.js/100px160" />
              <Card.Body>
                <Card.Title>{filename}</Card.Title>
                <Card.Text>
                  Give a short description of the data present for this text.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Library;
