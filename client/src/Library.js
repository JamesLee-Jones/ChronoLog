import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./App.css";
import "./Library.css";

function Library() {
    useEffect(() => {
        document.body.style.backgroundColor = "#eae0d5";
    });

    const [bookTitles, setBookTitles] = useState([])
    const [loading, setLoading] = useState(true)

    let filePaths = require.context("../public/library/", false, /\.json$/);
    filePaths = filePaths.keys();

    let newTitles = []

    async function getData(filename) {
        setLoading(true);
        await fetch(filename).then(response => {
            console.log(filename + ' being fetched')
            if (response.ok) {
                return response.json()
            }
            throw response;
        }).then(data => {
            newTitles.push(data["book"])
            console.log(newTitles)
        }).finally(() => {setLoading(false)});
    }

    function getAllData() {
        newTitles = []
        return Promise.all(filePaths.map(filename => getData(filename)))
    }

    useEffect(() => {
        getAllData().then(setBookTitles(newTitles))
        console.log(bookTitles)
    }, []);

    if (loading) return "Loading..."

    return (
        <div className="books">
            <Row xs={1} md={2} lg={4} className="g-4">
                {bookTitles.map((bookTitle) => (
                    <Col>
                        <Card className="text-center">
                            <Card.Img variant="top" src="../ChronoLogoMini.png"/>
                            <Card.Body>
                                <Card.Title>{bookTitle}</Card.Title>
                                <a href='' className="btn stretched-link">
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
