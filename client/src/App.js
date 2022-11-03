import React from 'react'
import Papa from "papaparse"
import ForceGraph2D from "react-force-graph-2d";


function App() {
  let url = "https://www.doc.ic.ac.uk/~dee20/web/matrices/two_interactions.output.csv";
  let results; 
  Papa.parse(url, {   
    download: true,
    complete: function (result) {
      results = result.data
    }
  })

  const data = {
    nodes: [
      { id: results[0][0] },
      { id: results[0][1] },
      { id: results[0][2] }
    ],
    links: [
      { source: results[0][0], target: results[0][1], value: parseInt(results[1][0]) * 10 },
      { source: results[0][0], target: results[0][2], value: parseInt(results[2][0]) * 10 },
      { source: results[0][1], target: results[0][2], value: parseInt(results[2][1]) * 10 }
    ]
  };

  return (
    <div>

    </div>
  )
  //"start": "react-scripts start",
    //"build": "react-scripts build",
}

export default App