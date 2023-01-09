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
import { BsPersonFill, FaBookOpen } from "react-icons/all";
import { IconContext } from "react-icons";
import { Tooltip } from "@mui/material";

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
                <row>
                  <Tooltip title="Select a section in the text to view.">
                    <div
                      style={{
                        float: "left",
                        width: "5%",
                        paddingTop: "5px",
                        paddingRight: "5px",
                      }}
                    >
                      <IconContext.Provider value={{ size: "2em" }}>
                        <FaBookOpen />
                      </IconContext.Provider>
                    </div>
                  </Tooltip>
                  <div style={{ float: "left", width: "95%" }}>
                    <TimelineNavigation
                      maxval={
                        data["sections"].length
                          ? data["sections"].length - 1
                          : 0
                      }
                      setCounter={setCounter}
                      counter={counter}
                      TimelineNavigation
                    />
                  </div>
                </row>
                <row>
                  <Tooltip title="Select the top number of characters to view.">
                    <div style={{ float: "left", width: "5%" }}>
                      <IconContext.Provider value={{ size: "2em" }}>
                        <BsPersonFill />
                      </IconContext.Provider>
                    </div>
                  </Tooltip>
                  <div style={{ float: "left", width: "95%" }}>
                    <CharacterSlider
                      maxval={
                        data["sections"].at(-1)
                          ? Math.min(
                              data["sections"].at(-1)["names"].length,
                              30
                            )
                          : 1
                      }
                      setCounter={setNumCharacters}
                      counter={numCharacters}
                      CharacterSlider
                    />
                  </div>
                </row>
              </Col>
              <Col sm={4}>
                <div className="metadata">
                  <MetadataNodeCard
                    node={node}
                    firstInteraction={node.First_Interaction}
                    betweenness_centrality={node.Betweenness_Centrality}
                    subgraph_centrality={node.Subgraph_Centrality}
                    degree_centraility={node.Degree_Centrality}
                  />
                  <MetadataLinkCard
                    link={link}
                    source={link.source}
                    target={link.target}
                    firstInteraction={
                      link.First_Interactions_Between_Characters
                    }
                    interaction_strength = {
                      link.value
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
