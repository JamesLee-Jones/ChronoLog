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

// Converts JSON data from backend into graph JSON data for react force graph
// function convert(data, characters) {
//   let result = [...data];
//   return result.map((d) => convertToGraph(d, characters));
// }

// function convertToGraph(data, characters) {
//   let nodes = [];
//   let links = [];
//   let scale = 10;
//   let names = data["names"];
//   let matrix = data["matrix"];
//   let numNodes = Math.min(names.length, characters);
//   for (let i = 0; i < numNodes; i++) {
//     nodes.push({ id: "id" + String(i), name: names[i] });
//   }
//   for (let j = 0; j < numNodes; j++) {
//     for (let k = 0; k < numNodes; k++) {
//       if (j !== k && matrix[j][k] !== 0) {
//         links.push({
//           source: "id" + String(j),
//           target: "id" + String(k),
//           value: matrix[j][k] * scale,
//           linkVisibility: true,
//         });
//       }
//     }
//   }
//   return { nodes: nodes, links: links };
// }

function addLinkMetaData(link, metaData, nodes) {
  let data = Object.keys(metaData);

  for (let i = 0; i < data.length; i++) {
    let metric = cleanString(data[i]);

    if (metaData[data[i]][idToName(nodes, link.source)] === undefined) {
      return link;
    }

    link[metric] =
      metaData[data[i]][idToName(nodes, link.source)][
        idToName(nodes, link.target)
      ];
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

    // if(links[i]["source"]["id"] === id){
    //     links[i]["value"] = links[i]["valSource"]
    // }else if (links[i]["target"]["id"] === id){
    //     links[i]["value"] = links[i]["valTarget"]
    // }
  }
}

// function revertLinks(links){

//     for (let i = 0; i < links.length; i++) {
//         console.log(links[i])
//         links[2]["value"] = 100
//     }
//     console.log(links)
// }

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
      curNode = addNodeMetadata(curNode, nodeMetadata);
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
            value: matrix[i][j] + matrix[j][i] * scale,
            valSource: matrix[i][j],
            valTarget: matrix[j][i],
            valTotal: matrix[i][j] + matrix[j][i] * scale,
            linkVisibility: true,
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

  const handleNodeClick = useCallback((node) => {
    let links = graphs[counter]["links"];

    if (activeNode === "") {
      setActiveNode(node["id"]);
    } else if (activeNode === node["id"]) {
      setActiveNode("");
      //revertLinks(links)
    } else {
      hideLinks(links, activeNode);
      setActiveNode(node["id"]);
    }

    hideLinks(links, node["id"]);

    setNode(node);
    console.log(node);
  });

  const handleLinkClick = useCallback((link) => {
    setLink(link);
    console.log(link);
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
    <>
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
