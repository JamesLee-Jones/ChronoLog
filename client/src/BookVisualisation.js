import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TimelineNavigation from "./Slider";
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
        let res = convertData(myJson);
        setData(res);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="graphDiv">
        <Graphs
          graphData={data["sections"]}
          counter={counter}
          setCounter={setCounter}
        ></Graphs>

        <TimelineNavigation
          maxval={data["sections"].length ? data["sections"].length - 1 : 0}
          setCounter={setCounter}
          counter={counter}
          TimelineNavigation
        />
      </div>
    </>
  );
}

export default BookVisualisation;
