import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import { ForceGraph2D } from "react-force-graph";
import { Slider, Box } from "@mui/material";

// Converts JSON data from backend into graph JSON data for react force graph
function convert(data) {
  let result = [...data["sections"]];
  return result.map(convertToGraph);
}

function convertToGraph(data) {
  let nodes = [];
  let links = [];
  let names = data["names"];
  let matrix = data["matrix"];
  let scaleFactor = 10;
  for (let i = 0; i < names.length; i++) {
    nodes.push({ id: "id" + String(i), name: names[i] });
  }
  for (let j = 0; j < names.length; j++) {
    for (let k = 0; k < names.length; k++) {
      if (j !== k && matrix[j][k] !== 0) {
        links.push({
          source: "id" + String(j),
          target: "id" + String(k),
          value: matrix[j][k] * scaleFactor,
        });
      }
    }
  }
  const graph = { nodes: nodes, links: links };
  return graph;
}

function App() {
  const [displayWidth, setDisplayWidth] = useState(window.innerWidth);
  const [displayHeight, setDisplayHeight] = useState(window.innerHeight);

  window.addEventListener("resize", () => {
    setDisplayWidth(window.innerWidth);
    setDisplayHeight(window.innerHeight);
  });

  // Mock data needed to allow the convert graph function to run on first pass
  let mock_data = {
    basic: "Mock ",
    numberOfSections: 10,
    chapterWise: true,
    sections: [
      {
        names: ["Bob", "Sam", "C"],
        matrix: [
          [0, 1, 1],
          [1, 0, 1],
          [1, 1, 0],
        ],
      },
    ],
  };

  let mock_graph = convert(mock_data);

  const [data, setData] = useState(mock_graph);
  const [counter, setCounter] = useState(0);

  // Fetches data outputted by the backend

  const getData = () => {
    fetch("winnie_the_pooh_analysis.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        let res = convert(myJson);
        setData(res);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  // Rendering Graph

  const forceRef = useRef(null);
  let repelStrength = -10;
  let centering = -120;
  let zoomingTime = 50;
  let padding = 130;
  let widthCentering = 300;
  let heightCentering = 100;

  useEffect(() => {
    forceRef.current.d3Force("charge").strength(repelStrength);
    forceRef.current.d3Force("center").x(centering);
    forceRef.current.zoomToFit(zoomingTime, padding);
  });

  return (
    <div className="App">
      <ForceGraph2D
        graphData={data[counter]}
        nodeLabel="name"
        linkCurvature="curvature"
        linkWidth="value"
        linkDirectionalParticleWidth={1}
        width={displayWidth - widthCentering}
        height={displayHeight - heightCentering}
        ref={forceRef}
        nodeAutoColorBy={"name"}
      />

      <Slider
        aria-label="Sections"
        defaultValue={0}
        valueLabelDisplay="auto"
        onChange={(_, value) => {
          setCounter(value);
        }}
        step={1}
        marks
        min={0}
        max={data.length - 1}
      />
    </div>
  );
}

export default App;
