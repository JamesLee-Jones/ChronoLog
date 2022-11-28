import React, { useEffect, useRef, useState, useCallback } from "react";
import { ForceGraph2D } from "react-force-graph";
import * as d3 from "d3";
import "./Graphs.css";

function addNodeMetadata(node, metaData) {
  let data = Object.keys(metaData);

  for (let i = 0; i < data.length; i++) {
    let metric = cleanString(data[i]);
    node[metric] = metaData[data[i]][node.name];
  }

  return node;
}

function cleanString(str) {
  const titleCase = str
    .toLowerCase()
    .split("_")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("_");

  return titleCase;
}

function hideLinks(links, id) {
  for (let i = 0; i < links.length; i++) {
    if (links[i]["source"]["id"] !== id) {
      links[i]["linkVisibility"] = !links[i]["linkVisibility"];
    }
  }
}

const Graphs = ({ graphData, nodeMetadata, counter, setNode, setLink }) => {
  const [graphs, setGraphs] = useState([{ nodes: [], links: [] }]);
  const [activeNode, setActiveNode] = useState("");
  const width = 550;
  const height = 550;

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
      let curNode = { id: "id" + String(i), name: names[i] };
      curNode = addNodeMetadata(curNode, nodeMetadata);
      nodes.push(curNode);
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

  useEffect(() => {
    setGraphs(convert(graphData));
  }, [graphData]);

  const handleClick = useCallback((node) => {
    let links = graphs[counter]["links"];

    if (activeNode === "") {
      setActiveNode(node["id"]);
    } else if (activeNode === node["id"]) {
      setActiveNode("");
    } else {
      hideLinks(links, activeNode);
      setActiveNode(node["id"]);
    }

    hideLinks(links, node["id"]);

    setNode(node);
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
        enableZoomInteraction={false}
      />
    </div>
  );
};

export default Graphs;
