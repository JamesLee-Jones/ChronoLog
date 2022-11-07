import React from 'react'
import './App.css';
import { ForceGraph2D } from 'react-force-graph';

function App() {
  const data = {
    nodes: [
      { id: "Andrew", name: "Andrew" },
      { id: "Sarah", name: "Sarah" },
      { id: "Mark", name: "Mark"}
    ],
    links: [
      { source: "Andrew", target: "Sarah", value: 1},
      { source: "Andrew", target: "Mark", value: 0},
      { source: "Sarah", target: "Mark", value: 0.333},

    ]
  };

  return (
    <div className="App">
      <ForceGraph2D graphData={data} />
    </div>
  );
}

export default App;
