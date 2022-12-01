import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TimelineNavigation from "./Slider";
import CharacterSlider from "./CharacterSlider";
import { useParams } from "react-router-dom";
import Graphs from "./Graphs";

function convertData(data) {
  return {
    book: data["book"],
    num_sections: data["num_sections"],
    sections: data["sections"],
  };
}

function BookVisualisation() {
  const [data, setData] = useState({ book: "", num_sections: 0, sections: [] });
  const [counter, setCounter] = useState(0);
  const [numCharacters, setNumCharacters] = useState(10);

  // Fetches data outputted by the backend
  const params = useParams();

  const getData = () => {
    fetch(params.book + ".json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        let res = convertData(myJson);
        setData(res);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="App">
        <Graphs
          graphData={data["sections"]}
          counter={counter}
          characters={numCharacters}
        ></Graphs>

        <TimelineNavigation
          maxval={data["sections"].length ? data["sections"].length - 1 : 0}
          setCounter={setCounter}
          counter={counter}
          TimelineNavigation
        />

        <CharacterSlider
          maxval={30}
          setCounter={setNumCharacters}
          counter={numCharacters}
          CharacterSlider
        />
      </div>
    </>
  );
}

export default BookVisualisation;
