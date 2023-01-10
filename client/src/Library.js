import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./App.css";
import "./Library.css";
import {CircularProgress, LinearProgress} from "@mui/material";

function Library() {
  useEffect(() => {
    document.body.style.backgroundColor = "#eae0d5";
  });

  const [bookTitles, setBookTitles] = useState([]);
  const [bookCovers, setBookCovers] = useState([]);
  const [bookAuthors, setBookAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  let filePaths = require.context("../public/library/", false, /\.json$/);
  filePaths = filePaths.keys();

  let newTitles = [];
  let newAuthors = [];

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
      newAuthors = [];
      data.forEach((d1) => {
        newTitles.push(d1["book"]);
      });
      data.forEach((d1) => {
        newAuthors.push(d1["author"]);
      });
      setBookTitles(newTitles);
      setBookAuthors(newAuthors);
    });
  }, []);

  let newBookCovers = [];

  useEffect(() => {
    setLoading(true);
    Promise.all(
        bookTitles.map((fp) =>
            fetch("https://gutendex.com/books/?search=" + fp)
                .then(checkStatus)
                .then(parseJSON)
                .catch((error) => console.log("There was a problem", error))
        )
    ).then((data) => {
      console.log("Post Promise.all", data);
      newBookCovers = [];
      data.forEach((d1) => {
        if (d1["results"][0] === undefined) {
          newBookCovers.push("../ChronoLogoMini.png");
        } else {
          newBookCovers.push(d1["results"][0]["formats"]["image/jpeg"]);
        }
      });
      setBookCovers(newBookCovers);
      setLoading(false);
    });
  }, [bookTitles]);

  console.log(bookCovers);

  function loadingBookCover(index) {
    if (loading) {
      return <LinearProgress sx={{bgcolor: "#eae0d5"}}/>
    } else {
      return <Card.Img variant="top" src={bookCovers[index]} />
    }
  }

  return (
      <div className="books">
        <Row xs={1} md={2} lg={4} className="g-4">
          {bookTitles.map((bookTitle, index) => (
              <Col>
                <Card className="text-center">
                  <Card>
                    {loadingBookCover(index)}
                  </Card>
                  <Card.Body>
                    <Card.Title>{bookTitle}</Card.Title>
                    <Card.Subtitle>{bookAuthors[index]}</Card.Subtitle>
                    <a
                        href={filePaths[index].slice(2, -5)}
                        className="btn stretched-link"
                    >
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
