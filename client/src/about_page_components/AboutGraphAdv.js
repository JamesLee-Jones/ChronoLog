import React, { useState, useEffect, useRef, useCallback } from "react";
import { ForceGraph2D } from "react-force-graph";

import * as d3 from "d3";

function AboutGraphAdv() {
  let node = [
    { id: "id1", name: "John", val: 3, oColour: "#a6cee3" },
    { id: "id2", name: "Sam", val: 3, oColour: "#1f78b4" },
    { id: "id3", name: "Lily", val: 3, oColour: "#b2df8a" },
    { id: "id4", name: "Sophia", val: 3, oColour: "#33a02c" },
  ];

  let link = [
    {
      source: "id1",
      target: "id3",
      val: 70,
      valSource: 10,
      valTarget: 60,
      valTotal: 70,
      linkVisibility: true,
      dashed: [1, 0],
    },
    {
      source: "id3",
      target: "id4",
      val: 10,
      valSource: 5,
      valTarget: 5,
      valTotal: 10,
      linkVisibility: true,
      dashed: [4, 3],
    },
  ];

  const [activeNode, setActiveNode] = useState("");
  const [graphs] = useState({ nodes: node, links: link });

  // Link Manipulation

  function hideLinks(links, id) {
    for (let i = 0; i < links.length; i++) {
      if (links[i]["source"]["id"] !== id && links[i]["target"]["id"] !== id) {
        links[i]["linkVisibility"] = !links[i]["linkVisibility"];
      }

      if (links[i]["source"]["id"] === id) {
        links[i]["val"] = JSON.parse(JSON.stringify(links[i]["valSource"]));
      } else if (links[i]["target"]["id"] === id) {
        links[i]["val"] = JSON.parse(JSON.stringify(links[i]["valTarget"]));
      }

      links[i]["dashed"] = links[i]["val"] < 20 ? [4, 3] : [1, 0];
    }
  }

  function revertLinks(links) {
    for (let i = 0; i < links.length; i++) {
      links[i]["val"] = JSON.parse(JSON.stringify(links[i]["valTotal"]));
      links[i]["dashed"] = links[i]["val"] < 20 ? [4, 3] : [1, 0];
      links[i]["linkVisibility"] = true;
    }
  }

  function revertNodes(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i]["color"] = JSON.parse(JSON.stringify(nodes[i]["oColour"]));
    }
  }

  const forceRef = useRef();

  const handleNodeClick = useCallback((node) => {
    let links = graphs["links"];

    if (activeNode === "") {
      setActiveNode(node["id"]);
      node["color"] = "red";
      hideLinks(links, node["id"]);
    } else if (activeNode === node["id"]) {
      setActiveNode("");
      node["color"] = node["oColour"];
      revertLinks(links);
    } else {
      revertLinks(links);
      revertNodes(graphs["nodes"]);
      setActiveNode(node["id"]);
      node["color"] = "red";
      hideLinks(links, node["id"]);
    }

    forceRef.current.d3ReheatSimulation();
  });

  const width = 500;
  const height = 300;

  useEffect(() => {
    forceRef.current.d3Force("charge", d3.forceManyBody().strength(-100));
    forceRef.current.d3Force("center", d3.forceCenter(0, 0));
    forceRef.current.d3Force("collide", d3.forceCollide());
    forceRef.current.d3Force("y", d3.forceY(-10));
    forceRef.current.d3Force("x", d3.forceX(-10));
  }, []);

  return (
    <div>
      <ForceGraph2D
        graphData={graphs}
        nodeLabel="name"
        linkWidth={4}
        linkDirectionalParticleWidth={4}
        nodeAutoColorBy={"name"}
        width={width}
        height={height}
        ref={forceRef}
        linkVisibility="linkVisibility"
        enablePanInteraction={false}
        enableZoomInteraction={false}
        linkLineDash="dashed"
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}

export default AboutGraphAdv;
