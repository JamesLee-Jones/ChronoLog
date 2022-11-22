import React from "react";
import { Slider } from "@mui/material";

const TimelineNavigation = ({ maxval, setCounter }) => {
  let scale = 100;

  return (
    <Slider
      aria-label="Sections"
      defaultValue={1}
      valueLabelDisplay="off"
      onChange={(_, value) => {
        setCounter(Math.round(value / scale));
      }}
      step={1}
      sx={{
        width: 600,
        height: 20,
        color: "#C6AC8F",
      }}
      min={0}
      max={maxval * scale}
    />
  );
};
export default TimelineNavigation;
