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

const CharacterSlider = ({ maxval, setCounter, counter }) => {
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
          width: window.width * 0.5,
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
    </div>
  );
};
export default CharacterSlider;
