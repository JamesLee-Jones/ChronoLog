import React, {useState, useEffect }from 'react'
import { readString } from 'react-papaparse'
import Papa from "papaparse"

function App() {
  file = '../tests/matrices/one_interaction.output.csv';
  const [parsedCsvData, setParsedCsvData] = useState([]); const parseFile = file => {
    Papa.parse(file, {
      header: true,
      complete: results => {
        setParsedCsvData(results.data)
      },
    });
  };

  console.log(parsedCsvData);

  FileSystem.readFile()
  useEffect(() => {
    
  })
  return (
    <div>

    </div>
  )
}

export default App