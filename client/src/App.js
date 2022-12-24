import React from "react";
import "./App.css";
import ChronoLogNavBar from "./ChronoLogNavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";
import Library from "./Library";
import About from "./About";
import BookVisualisation from "./BookVisualisation";
import HomePage from "./NewHomepage";

function App() {
  return (
    <BrowserRouter>
      <ChronoLogNavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/library/" element={<Library />} />
        <Route path="/library/:book/" element={<BookVisualisation />} />
        <Route path="/about/" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
