import React, { useState, useEffect, useRef } from "react";
import { Slider } from "@mui/material";
import {
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoPlay,
  IoPause,
} from "react-icons/io5";

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

const AboutNavigation = () => {
  const [mark, setMark] = useState([]);
  const [run, setRun] = useState(false);
  const [sliderVal, setSliderVal] = useState(0);
  const [sliderVal2, setSliderVal2] = useState(0);
  const [counter, setCounter] = useState(0);

  let scale = 100;

  useInterval(
    () => {
      if (sliderVal > 10 * scale) {
        setRun(false);
      }

      setSliderVal(sliderVal + 1);
      setCounter(Math.floor(sliderVal / scale));
    },
    run ? 50 : null
  );

  useEffect(() => {
    setMark(generate_markers(10, scale));
  }, [10]);

  useEffect(() => {
    setSliderVal(counter * scale);
  }, [counter]);

  const onNext = () => {
    if (counter === 10) {
      return;
    }

    setCounter(counter + 1);
  };

  const onPrev = () => {
    if (counter === 0) {
      return;
    }

    setCounter(counter - 1);
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
          width: 250,
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
        max={10 * scale}
      />

      <div style={{ paddingLeft: "15px" }}>
        <div
          className="btn"
          onClick={onPrev}
          style={{ color: "#22333b", fontSize: "50px" }}
        >
          <IoPlaySkipBack></IoPlaySkipBack>
        </div>

        <div
          className="btn"
          onClick={() => {
            setRun(!run);
            if (sliderVal > 10 * scale && !run) {
              setCounter(0);
              setSliderVal(0);
            }
          }}
          style={{ color: "#22333b", fontSize: "50px" }}
        >
          {run ? <IoPause></IoPause> : <IoPlay></IoPlay>}
        </div>

        <div
          className="btn"
          onClick={onNext}
          style={{ color: "#22333b", fontSize: "50px" }}
        >
          <IoPlaySkipForward></IoPlaySkipForward>
        </div>
      </div>

      <Slider
        aria-label="Sections"
        defaultValue={0}
        marks={mark}
        value={sliderVal2}
        valueLabelDisplay="off"
        onChange={(_, value) => {
          setSliderVal2(value);
        }}
        step={1}
        sx={{
          width: 250,
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
        max={10 * scale}
      ></Slider>
    </div>
  );
};
export default AboutNavigation;
