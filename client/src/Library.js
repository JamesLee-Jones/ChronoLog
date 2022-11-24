import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./App.css";
import "./Library.css";

function convertGutendexJSON(data) {
  let bookName = data["results"][0]["title"]
  let bookAuthor = data["results"][0]["authors"][0]["name"]
  let bookCoverUrl = data["results"][0]["formats"]["image/jpeg"]
  return {id : 1, title : bookName, authors : bookAuthor, cover: bookCoverUrl};
}

function convertBookData(data) {
  let bookTitle = data["book"]
  console.log(bookTitle)
  return {title : bookTitle};
}

function Library() {

  const [gutendexData, setGutendexData] = useState({ id: {}, title: {}, authors: {}, cover: {}});
  const [bookTitle, setBookTitle] = useState({ title: {}});

  const getData = () => {
    fetch("https://gutendex.com/books?search="+bookTitle, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        let res = convertGutendexJSON(myJson)
        setGutendexData(res);
      });
  };

  useEffect(() => {
    getData();
    console.log(gutendexData)
  }, []);

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

  const getBookTitle = () => {
    fetch("library/the_hobbit_sample.json", {
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        let res = convertBookData(myJson)
        setBookTitle(res);
        console.log(bookTitle)
      });
  };

  useEffect(() => {
    getBookTitle();
    console.log(bookTitle["title"])
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "#eae0d5";
  });


  return (
      <div className="books">
        <Row xs={1} md={2} lg={4} className="g-4">
          {bookTitles.map((bookTitle, index) => (
              <Col>
                <Card className="text-center">
                  <Card.Img variant="top" src="../ChronoLogoMini.png" />
                  <Card.Body>
                    <Card.Title>{bookTitle}</Card.Title>
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
=======
    <div className="books">
      <Row xs={1} md={2} lg={4} className="g-4">
        {files.map((filename) => (
          <Col>
            <Card className="text-center">
              <Card.Img variant="top" src={gutendexData.cover} />
              <Card.Body>
                <Card.Title>{filename.replaceAll("_", " ")}</Card.Title>
                <a href={filename} class="btn stretched-link">
                  View graph
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
>>>>>>> a0b8983 (Fetched book covers using Gutendex's web API)
  );
}

export default Library;
