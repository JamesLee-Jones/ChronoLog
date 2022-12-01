import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import "./App.css";

function HomePage() {
  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);

  const [active3, setActive3] = useState(false);

  const [active4, setActive4] = useState(false);

  const [active5, setActive5] = useState(false);

  const buttonColor1 = () => {
    setActive1(!active1);
  };

  const buttonColor2 = () => {
    setActive2(!active3);
  };

  const buttonColor3 = () => {
    setActive3(!active3);
  };

  const buttonColor4 = () => {
    setActive4(!active4);
  };

  const buttonColor5 = () => {
    setActive5(!active5);
  };

  return (
    <div className="container py-4">
      <header class="p-5 mb-4">
        <div className="p mb-4 rounded-3">
          <div className="container-fluid py-5">
            <h1 className="title">ChronoLog.</h1>
            <Button
              onClick={buttonColor1}
              id="button"
              className="rounded-circle"
              style={{
                backgroundColor: active1 ? "#22333b" : "#CDCCCA",
                borderColor: active1 ? "#22333b" : "#CDCCCA",
              }}
            >
              I
            </Button>
            <Button
              onClick={buttonColor2}
              id="button2"
              className="rounded-circle"
              style={{
                backgroundColor: active2 ? "#22333b" : "#CDCCCA",
                borderColor: active2 ? "#22333b" : "#CDCCCA",
              }}
            >
              II
            </Button>
            <Button
              onClick={buttonColor3}
              id="button3"
              className="rounded-circle"
              style={{
                backgroundColor: active3 ? "#22333b" : "#CDCCCA",
                borderColor: active3 ? "#22333b" : "#CDCCCA",
              }}
            >
              III
            </Button>
            <Button
              onClick={buttonColor4}
              id="button4"
              className="rounded-circle"
              style={{
                backgroundColor: active4 ? "#22333b" : "#CDCCCA",
                borderColor: active4 ? "#22333b" : "#CDCCCA",
              }}
            >
              IV
            </Button>
            <Button
              onClick={buttonColor5}
              id="button5"
              className="rounded-circle"
              style={{
                backgroundColor: active5 ? "#22333b" : "#CDCCCA",
                borderColor: active5 ? "#22333b" : "#CDCCCA",
              }}
            >
              V
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default HomePage;
