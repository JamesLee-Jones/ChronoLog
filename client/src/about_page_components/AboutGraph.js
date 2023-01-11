import React from "react";
import { ForceGraph2D } from "react-force-graph";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

function AboutGraph() {
  let node = [
    { id: "id1", name: "John", val: "3" },
    { id: "id2", name: "Sam", val: "3" },
    { id: "id3", name: "Lily", val: "3" },
    { id: "id4", name: "Sophia", val: "3" },
  ];

  let link = [
    { source: "id1", target: "id3" },
    { source: "id3", target: "id4" },
  ];

  const width = 500;
  const height = 300;

  const forceRef = useRef();

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
        graphData={{ nodes: node, links: link }}
        nodeLabel="name"
        linkWidth={4}
        linkDirectionalParticleWidth={4}
        nodeAutoColorBy={"name"}
        width={width}
        height={height}
        ref={forceRef}
        enablePanInteraction={false}
        enableZoomInteraction={false}
      />
    </div>
  );
}

export default AboutGraph;
