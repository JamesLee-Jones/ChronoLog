import React, { useEffect, useRef, useState, useCallback } from "react";
import { ForceGraph2D } from "react-force-graph";
import * as d3 from "d3";

// Converts JSON data from backend into graph JSON data for react force graph
function convert(data) {
  let result = [...data];
  return result.map(d => convertToGraph(d));
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
    let convertedGraphData = convert(graphData)
    setGraphs(convertedGraphData);
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

  let currGraph = {nodes: [], links: []}
  useEffect(() => {
    // setFilteredGraphs(graphs.map((graph) => {return {nodes: graph["nodes"].slice(0, characters), links: graph["links"]}})
    //     .filter(l => parseInt(l["links"]["source"].substr(2)) < characters && parseInt(l["links"]["target"].substr(2)) < characters))
    currGraph["nodes"] = graphs[counter]["nodes"].slice(0, characters)
    currGraph["links"] = graphs[counter]["links"].filter(l => parseInt(l["source"].toString().slice(2)) < characters && parseInt(l["target"].toString().slice(2)) < characters)
    },
      [characters, counter]
  )

  return (
    <div>
      <ForceGraph2D
        graphData={currGraph}
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
