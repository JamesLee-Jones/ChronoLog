import React, { useEffect, useRef, useState, useCallback } from "react";
import { ForceGraph2D } from "react-force-graph";
import * as d3 from "d3";
import "./Graphs.css";

function addNodeMetadata(node, metaData, extraData) {
  let data = Object.keys(metaData);
  let eData = [];
  eData.push("betweenness_centrality");
  eData.push("degree_centrality");
  eData.push("subgraph_centrality");

  for (let i = 0; i < data.length; i++) {
    let metric = cleanString(data[i]);
    node[metric] = metaData[data[i]][node.name];
  }

  for (let i = 0; i < eData.length; i++) {
    let metric = cleanString(eData[i]);
    node[metric] = extraData[eData[i]][node.name];
  }

  return node;
}

function addLinkMetaData(link, metaData, nodes) {
  let data = Object.keys(metaData);

  for (let i = 0; i < data.length; i++) {
    let metric = cleanString(data[i]);

    if (metaData[data[i]][idToName(nodes, link.source)] !== undefined) {
      link[metric] =
        metaData[data[i]][idToName(nodes, link.source)][
          idToName(nodes, link.target)
        ];
    }

    if (metaData[data[i]][idToName(nodes, link.target)] !== undefined) {
      if (link[metric] === undefined) {
        link[metric] =
          metaData[data[i]][idToName(nodes, link.target)][
            idToName(nodes, link.source)
          ];
      }
    }
  }

  return link;
}

function idToName(nodes, id) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i]["id"] === id) {
      return nodes[i]["name"];
    }
  }
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
    if (links[i]["source"]["id"] !== id && links[i]["target"]["id"] !== id) {
      links[i]["linkVisibility"] = !links[i]["linkVisibility"];
    }

    if (links[i]["source"]["id"] === id) {
      links[i]["value"] = JSON.parse(JSON.stringify(links[i]["valSource"]));
    } else if (links[i]["target"]["id"] === id) {
      links[i]["value"] = JSON.parse(JSON.stringify(links[i]["valTarget"]));
    }

    links[i]["linkLineDash"] = links[i]["value"] < 1 ? [4, 3] : [1, 0];
  }
}

function revertLinks(links) {
  for (let i = 0; i < links.length; i++) {
    links[i]["value"] = JSON.parse(JSON.stringify(links[i]["valTotal"]));
    links[i]["linkLineDash"] = links[i]["value"] < 1 ? [4, 3] : [1, 0];
    links[i]["linkVisibility"] = true;
  }
}

const Graphs = ({
  graphData,
  nodeMetadata,
  linkMetadata,
  counter,
  setNode,
  setLink,
  characters,
}) => {
  const [graphs, setGraphs] = useState([{ nodes: [], links: [] }]);
  const [activeNode, setActiveNode] = useState("");
  const width = 800;
  const height = 550;

  // Converts JSON data from backend into graph JSON data for react force graph
  function convert(data, characters) {
    let result = [...data];
    return result.map((d) => convertToGraph(d, characters));
  }

  function convertToGraph(data, characters) {
    let nodes = [];
    let links = [];
    let ids = [];
    let scale = 10;
    let names = data["names"];
    let matrix = data["matrix"];
    let numNodes = Math.min(characters, names.length);
    for (let i = 0; i < numNodes; i++) {
      let curNode = { id: "id" + String(i), name: names[i] };
      curNode = addNodeMetadata(
        curNode,
        nodeMetadata,
        data["graph_attributes"]
      );

      nodes.push(curNode);
      ids.push(i);
    }

    while (ids.length !== 1) {
      let i = ids[0];
      for (let j = i; j < numNodes; j++) {
        if (matrix[i][j] !== 0 && j !== i) {
          let curLink = {
            source: "id" + String(i),
            target: "id" + String(j),
            value: ((matrix[i][j] + matrix[j][i]) / 2) * scale,
            valSource: matrix[i][j] * scale,
            valTarget: matrix[j][i] * scale,
            valTotal: ((matrix[i][j] + matrix[j][i]) / 2) * scale,
            linkVisibility: true,
            linkLineDash:
              matrix[i][j] + matrix[j][i] * scale < 1 ? [4, 3] : [1, 0],
          };

          curLink = addLinkMetaData(curLink, linkMetadata, nodes);
          links.push(curLink);
        }
      }

      ids.shift();
    }

    return { nodes: nodes, links: links };
  }

  useEffect(() => {
    let convertedGraphData = convert(graphData, characters);
    setGraphs(convertedGraphData);
  }, [graphData, characters]);

  const forceRef = useRef();

  const handleNodeClick = useCallback((node) => {
    let links = graphs[counter]["links"];

    if (activeNode === "") {
      setActiveNode(node["id"]);
      hideLinks(links, node["id"]);
    } else if (activeNode === node["id"]) {
      setActiveNode("");
      revertLinks(links);
    } else {
      revertLinks(links);
      setActiveNode(node["id"]);
      hideLinks(links, node["id"]);
    }

    setNode(activeNode === node["id"] ? {} : node);

    forceRef.current.d3ReheatSimulation();
  });

  const handleLinkClick = useCallback((link) => {
    setLink(link);
  });

  useEffect(() => {
    forceRef.current.d3Force("charge", d3.forceManyBody().strength(-200));
    forceRef.current.d3Force("center", d3.forceCenter(0, 0));
    forceRef.current.d3Force("collide", d3.forceCollide(10));
    forceRef.current.d3Force("y", d3.forceY(10));
    forceRef.current.d3Force("x", d3.forceX(10));
  }, []);

  return (
    <>
      <div className="graph">
        <ForceGraph2D
          graphData={graphs[counter]}
          nodeLabel="name"
          linkWidth={4}
          linkLineDash="linkLineDash"
          linkVisibility="linkVisibility"
          linkDirectionalParticleWidth={4}
          width={width}
          height={height}
          ref={forceRef}
          nodeAutoColorBy={"name"}
          onNodeClick={handleNodeClick}
          onLinkClick={handleLinkClick}
          enablePanInteraction={false}
          enableZoomInteraction={true}
        />
      </div>
    </>
  );
};

export default Graphs;
