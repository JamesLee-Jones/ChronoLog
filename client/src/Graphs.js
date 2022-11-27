import React, { useEffect, useRef, useState, useCallback } from "react";
import { ForceGraph2D } from "react-force-graph";
import * as d3 from "d3";
import "./Graphs.css";

// Converts JSON data from backend into graph JSON data for react force graph
function convert(data) {
  let result = [...data];
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
          linkVisibility: true,
        });
      }
    }
  }
  return { nodes: nodes, links: links };
}

const Graphs = ({ graphData, counter }) => {
  const [graphs, setGraphs] = useState([{ nodes: [], links: [] }]);
  const [activeNode, setActiveNode] = useState("");
  const width = 550;
  const height = 550;

  useEffect(() => {
    setGraphs(convert(graphData));
  }, [graphData]);

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
  });

  const forceRef = useRef();

  useEffect(() => {
    forceRef.current.d3Force("charge", d3.forceManyBody().strength(-150));
    forceRef.current.d3Force("center", d3.forceCenter(0, 0));
    forceRef.current.d3Force("collide", d3.forceCollide());
    forceRef.current.d3Force("y", d3.forceY(10));
    forceRef.current.d3Force("x", d3.forceX(10));
  }, []);

  return (
    <div className="graph">
      <ForceGraph2D
        graphData={graphs[counter]}
        nodeLabel="name"
        linkWidth="value"
        linkVisibility="linkVisibility"
        linkDirectionalParticleWidth={4}
        width={width}
        height={height}
        ref={forceRef}
        nodeAutoColorBy={"name"}
        onNodeClick={handleClick}
        enablePanInteraction={false}
        enableZoomInteraction={true}
      />
    </div>
  );
};

export default Graphs;
