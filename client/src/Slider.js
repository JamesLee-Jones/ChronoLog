import React, { useState, useEffect, useRef } from "react";
import { Slider } from "@mui/material";

function generate_markers(val, scale) {
  let res = [];
  for (let i = 0; i < val; i++) {
    res.push({ value: i * scale });
  }
  return res;
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const TimelineNavigaion = ({ maxval, setCounter, counter }) => {
  const [mark, setMark] = useState([]);
  const [run, setRun] = useState(false);
  const [sliderVal, setSliderVal] = useState(0);

  let scale = 100;

  useInterval(
    () => {
      if (sliderVal > maxval * scale) {
        setRun(false);
      }

      setSliderVal(sliderVal + 1);
      setCounter(Math.floor(sliderVal / scale));
    },
    run ? 50 : null
  );

  useEffect(() => {
    setMark(generate_markers(maxval, scale));
  }, [maxval]);

  useEffect(() => {
    setSliderVal(counter * scale);
  }, [counter]);

  const onNext = () => {
    if (counter === maxval) {
      return;
    }

    console.log(counter);
    setCounter(counter + 1);
    console.log(counter);
  };

  const onPrev = () => {
    if (counter === 0) {
      return;
    }

    console.log(counter);
    setCounter(counter - 1);
    console.log(counter);
  };

  return (
    <div>
      <Slider
        aria-label="Sections"
        defaultValue={0}
        marks={mark}
        value={sliderVal}
        valueLabelDisplay="off"
        onChange={(_, value) => {
          let val = Math.floor(value / scale);
          setCounter(val);
          setSliderVal(value);
        }}
        step={1}
        sx={{
          width: 700,
          height: 20,
          color: "#C6AC8F",
          ".MuiSlider-mark": {
            color: "#22333B",
            height: 5,
            width: 5,
          },
          ".MuiSlider-thumb": {
            color: "#22333B",
          },
        }}
        min={1}
        max={maxval * scale}
      />

      <button
        style={{ backgroundColor: "#0A0908", color: "white" }}
        className="btn"
        onClick={onPrev}
      >
        {"Previous"}
      </button>
      <button
        onClick={() => {
          setRun(!run);
          if (sliderVal > maxval * scale && !run) {
            setCounter(0);
            setSliderVal(0);
          }
        }}
        style={{ backgroundColor: "#0A0908", color: "white" }}
        className="btn"
      >
        {run ? "Pause" : "Play"}
      </button>
      <button
        style={{ backgroundColor: "#0A0908", color: "white" }}
        className="btn"
        onClick={onNext}
      >
        {"Next"}
      </button>
    </div>
  );
};
export default TimelineNavigaion;
