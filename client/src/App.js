import React from "react";
import "./App.css";
import ChronoLogNavBar from "./ChronoLogNavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";
import Home from "./Home";
import Library from "./Library";
import About from "./About";

function App() {
  return (
    <BrowserRouter>
      <ChronoLogNavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
