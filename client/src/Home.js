import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Graph from "./Graph";

function Home() {
  return (
    <>
      <div class="chronolog-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
      <img src="../ChronoLogo.png" class="img-fluid" alt="ChronoLogo" />
      <div class="about-chronolog">
        <p>Beautiful data.</p>
      </div>
      </div>
      <Graph />
    </>
  );
}

export default Home;
