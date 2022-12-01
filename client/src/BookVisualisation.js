import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TimelineNavigation from "./Slider";
import CharacterSlider from "./CharacterSlider";
import { useParams } from "react-router-dom";
import Graphs from "./Graphs";
import MetadataNodeCard from "./MetadataNodeCard";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import MetadataLinkCard from "./MetadataLinkCard";
import MetadataAnalysisCard from "./MetadataAnalysisCard";

function convertData(data) {
  return {
    book: data["book"],
    num_sections: data["num_sections"],
    sections: data["sections"],
    first_interactions_between_characters:
      data["first_interactions_between_characters"],
    first_interaction: data["first_interactions_overall"],
  };
}

function BookVisualisation() {
  const [data, setData] = useState({
    book: "",
    num_sections: 0,
    sections: [],
    first_interactions_between_characters: {},
    first_interaction: {},
  });
  const [counter, setCounter] = useState(0);
  const [node, setNode] = useState({});
  const [link, setLink] = useState({});
  const [numCharacters, setNumCharacters] = useState(30);

  // Fetches data outputted by the backend
  const params = useParams();

  const getData = () => {
    fetch(params.book + ".json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        let res = convertData(myJson);
        setData(res);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="bookViz">
        <Container fluid={"true"}>
          <h1>{data.book}</h1>
        </Container>

        <div className="App">
          <Container fluid={"md"}>
            <Row>
              <Col sm={8}>
                <Graphs
                  graphData={data["sections"]}
                  nodeMetadata={{
                    first_interaction: data["first_interaction"],
                  }}
                  linkMetadata={{
                    first_interactions_between_characters:
                      data["first_interactions_between_characters"],
                  }}
                  counter={counter}
                  setNode={setNode}
                  setLink={setLink}
                  characters={numCharacters}
                ></Graphs>
                <TimelineNavigation
                  maxval={
                    data["sections"].length ? data["sections"].length - 1 : 0
                  }
                  setCounter={setCounter}
                  counter={counter}
                  TimelineNavigation
                />
                <CharacterSlider
                  maxval={30}
                  setCounter={setNumCharacters}
                  counter={numCharacters}
                  CharacterSlider
                />
              </Col>
              <Col sm={4}>
                <div className="metadata">
                  <MetadataNodeCard
                    node={node}
                    firstInteraction={node.First_Interaction}
                  />
                  <MetadataLinkCard
                    link={link}
                    source={link.source}
                    target={link.target}
                    firstInteraction={
                      link.First_Interactions_Between_Characters
                    }
                  />
                  <MetadataAnalysisCard
                    graphAttributes={
                      data.sections[counter]
                        ? data.sections[counter].graph_attributes
                        : undefined
                    }
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
}

export default BookVisualisation;
