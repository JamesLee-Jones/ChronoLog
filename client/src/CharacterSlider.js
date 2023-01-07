import React, { useState, useEffect, useRef } from "react";
import { Slider } from "@mui/material";

function generate_markers(val) {
  let res = [];
  for (let i = 0; i < val; i++) {
    res.push({ value: i });
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

  useInterval(
    () => {
      if (sliderVal > maxval) {
        setRun(false);
      }

      setSliderVal(sliderVal + 1);
      setCounter(Math.floor(sliderVal));
    },
    run ? 50 : null
  );

  useEffect(() => {
    setMark(generate_markers(maxval));
  }, [maxval]);

  useEffect(() => {
    setSliderVal(counter);
  }, [counter]);

  return (
    <div>
      <Slider
        aria-label="characters"
        defaultValue={0}
        marks={mark}
        value={sliderVal}
        valueLabelDisplay="on"
        onChange={(_, value) => {
          setCounter(value);
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
        max={maxval}
      />
    </div>
  );
};
export default CharacterSlider;
