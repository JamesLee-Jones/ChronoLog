import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ForceGraph2D } from "react-force-graph";
import TimelineNavigation from "./Slider";

// Converts JSON data from backend into graph JSON data for react force graph
function convert(data) {
  let result = [...data["sections"]];
  return result.map(convertToGraph);
}

function convertToGraph(data) {
  let nodes = [];
  let links = [];
  let scale = 10;
  let names = data["names"];
  let matrix = data["matrix"];
  for (let i = 0; i < names.length; i++) {
    nodes.push({ id: "id" + String(i), name: names[i] });
  }
  for (let j = 0; j < names.length; j++) {
    for (let k = 0; k < names.length; k++) {
      if (j !== k && matrix[j][k] !== 0) {
        links.push({
          source: "id" + String(j),
          target: "id" + String(k),
          value: matrix[j][k] * scale,
        });
      }
    }
  }
  return { nodes: nodes, links: links };
}

function Home() {
  const [displayWidth, setDisplayWidth] = useState(window.innerWidth);
  const [displayHeight, setDisplayHeight] = useState(window.innerHeight);

  window.addEventListener("resize", () => {
    setDisplayWidth(window.innerWidth);
    setDisplayHeight(window.innerHeight);
  });

  const [data, setData] = useState({ nodes: {}, links: {} });
  const [counter, setCounter] = useState(0);

  // Fetches data outputted by the backend

  const getData = () => {
    fetch("timelines/winnie_the_pooh_final_analysis.json", {
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
    document.body.style.backgroundColor = "#eae0d5";
  });

  return (
    <>
      <div class="chronolog-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <img src="../ChronoLogo.png" class="img-fluid" alt="ChronoLogo" />
        <div class="about-chronolog">
          <p>Beautiful data.</p>
        </div>
      </div>
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

        <TimelineNavigation
          maxval={data.length - 1}
          setCounter={setCounter}
          TimelineNavigaion
        />
      </div>
    </>
  );
}

export default Home;
