import React, { useEffect, useRef, useState, useCallback } from "react";
import { ForceGraph2D } from "react-force-graph";
import * as d3 from "d3";

// Converts JSON data from backend into graph JSON data for react force graph
function convert(data, characters) {
  let result = [...data];
  return result.map((d) => convertToGraph(d, characters));
}

function convertToGraph(data, characters) {
  let nodes = [];
  let links = [];
  let scale = 10;
  let names = data["names"];
  let matrix = data["matrix"];
  let numNodes = Math.min(names.length, characters);
  for (let i = 0; i < numNodes; i++) {
    nodes.push({ id: "id" + String(i), name: names[i] });
  }
  for (let j = 0; j < numNodes; j++) {
    for (let k = 0; k < numNodes; k++) {
      if (j !== k && matrix[j][k] !== 0) {
        links.push({
          source: "id" + String(j),
          target: "id" + String(k),
          value: matrix[j][k] * scale,
          linkVisibility: true,
        });
      }
    }
  }
  return { nodes: nodes, links: links };
}

const Graphs = ({ graphData, counter, characters }) => {
  const [displayWidth, setDisplayWidth] = useState(window.innerWidth);
  const [displayHeight, setDisplayHeight] = useState(window.innerHeight);

  const [graphs, setGraphs] = useState([{ nodes: [], links: [] }]);
  const [activeNode, setActiveNode] = useState(false);

  window.addEventListener("resize", () => {
    setDisplayWidth(window.innerWidth);
    setDisplayHeight(window.innerHeight);
  });

  useEffect(() => {
    let convertedGraphData = convert(graphData, characters);
    setGraphs(convertedGraphData);
  }, [graphData, characters]);

  const handleClick = useCallback((node) => {
    if (activeNode === "") {
      setActiveNode(node["id"]);
    } else if (activeNode === node["id"]) {
      setActiveNode("");
    } else {
      return;
    }

    let links = graphs[counter]["links"];
    for (let i = 0; i < links.length; i++) {
      if (links[i]["source"]["id"] !== node["id"]) {
        links[i]["linkVisibility"] = !links[i]["linkVisibility"];
      }
    }
  }, []);

  const forceRef = useRef(null);
  let padding = 30;

  useEffect(() => {
    forceRef.current.d3Force("charge", d3.forceManyBody().strength(-200));
    forceRef.current.d3Force("center", d3.forceCenter(20, 20));
    forceRef.current.d3Force("collide", d3.forceCollide());
    forceRef.current.d3Force("y", d3.forceY(10));
    forceRef.current.d3Force("x", d3.forceX(10));
  });

  return (
    <div>
      <ForceGraph2D
        graphData={graphs[counter]}
        nodeLabel="name"
        linkCurvature="curvature"
        linkWidth="value"
        linkVisibility="linkVisibility"
        linkDirectionalParticleWidth={1}
        width={displayWidth / 2}
        height={displayHeight / 2}
        onEngineStop={() => {
          forceRef.current.zoomToFit(0, padding);
        }}
        ref={forceRef}
        nodeAutoColorBy={"name"}
        onNodeClick={handleClick}
      />
    </div>
  );
};

export default Graphs;
