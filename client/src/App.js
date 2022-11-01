import React, { useRef, useEffect, useState } from 'react'
import './App.css';
import { ForceGraph2D } from 'react-force-graph';


// Converts JSON data from backend into graph JSON data for react force graph
function convertToGraph(data){
  let nodes = []
  let links = []
  let names = data["Sections"][0]["names"]
  let matrix = data["Sections"][0]["matrix"]
  for (let i = 0; i < names.length; i++) {
    nodes.push({ id: "id" + String(i), name: names[i] })
  }
  for (let j = 0; j < names.length; j++) {
    for (let k = 0; k < names.length; k++) {
      if (j !== k) {
        links.push({ source: "id" + String(j), target: "id" + String(k), value: matrix[j][k] })
      }
    }
  }
  const graph = { nodes: nodes, links: links }
  return graph
  
}

function App() {
  
  // Mock data needed to allow the convert graph function to run on first pass 
  let mock_data = {
    "basic":"Mock ",
    "numberOfSections":10,
    "chapterWise": true,
    "Sections":[
        {"names":["Bob", "Sam", "C"], 
    "matrix": [[0, 1, 1], 
               [1, 0, 1], 
               [1, 1, 0]]}
            ]
    }

  let mock_graph = convertToGraph(mock_data)

  const [data, setData] = useState(mock_graph)

  // Fetches data outputted by the backend 

  const getData=()=>{

    fetch('timeline.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
    .then(function (response) {
      return response.json();

    })
    .then(function (myJson) {
      setData(convertToGraph(myJson))
      });
  }

  useEffect(()=>{
    getData()
  },[])


  // Rendering Graph 

  const forceRef = useRef(null);
  useEffect(() => {
    forceRef.current.d3Force("charge").strength(-400);  });

  return (
    <div className="App">
       <ForceGraph2D
          graphData={data}
          nodeLabel="name"
          linkCurvature="curvature"
          enablePointerInteraction={true}
          linkDirectionalParticleWidth={1}
          ref={forceRef}
    />
    </div>
  );
}

export default App;
