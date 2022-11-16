import React, { useRef, useEffect, useState } from 'react'
import './App.css';
import { ForceGraph2D } from 'react-force-graph';
import TimelineNavigaion from './Slider';

// Converts JSON data from backend into graph JSON data for react force graph
function convert(data) {
  let result = [...data["Sections"]]
  return result.map(convertToGraph)

}

function convertToGraph(data){
  let nodes = []
  let links = []
  let names = data["names"]
  let matrix = data["matrix"]
  for (let i = 0; i < names.length; i++) {
    nodes.push({ id: "id" + String(i), name: names[i] })
  }
  for (let j = 0; j < names.length; j++) {
    for (let k = 0; k < names.length; k++) {
      if (j !== k && matrix[j][k] !== 0) {
        links.push({ source: "id" + String(j), target: "id" + String(k), value: matrix[j][k] })
      }
    }
  }
  const graph = { nodes: nodes, links: links }
  return graph
  
}

function App() {
  
  const [data, setData] = useState({nodes: {}, links: {}})
  const [counter, setCounter] = useState(0)

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
      let res = convert(myJson)
      setData(res)
      });
  }

  useEffect(()=>{
    getData()
  },[])


  // Rendering Graph 

  const forceRef = useRef(null);
  let repelStrength = -400;

  useEffect(() => {
    forceRef.current.d3Force("charge").strength(repelStrength);  });

  return (
    <div className="App">
       <ForceGraph2D
          graphData={data[counter]}
          nodeLabel="name"
          linkCurvature="curvature"
          linkWidth="value"
          linkDirectionalParticleWidth={1}
          ref={forceRef}
          centerAt={([500],[500])}
          />
      

          <TimelineNavigaion
             maxval={data.length - 1} 
             setCounter={setCounter} 

          TimelineNavigaion/>

           
    </div>


  );
}

export default App;
