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
import Graph from "./Graph";

function App() {
  const [displayWidth, setDisplayWidth] = useState(window.innerWidth);
  const [displayHeight, setDisplayHeight] = useState(window.innerHeight);

  window.addEventListener("resize", () => {
    setDisplayWidth(window.innerWidth);
    setDisplayHeight(window.innerHeight);
  });

  const [data, setData] = useState({ nodes: {}, links: {} });
  const [counter, setCounter] = useState(0);

  // Fetches data outputted by the backend

  const getData = () => {
    fetch("winnie_the_pooh_final_analysis.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        let res = convert(myJson);
        setData(res);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  // Rendering Graph

  const forceRef = useRef(null);
  let repelStrength = -10;
  let padding = 30;

  useEffect(() => {
    forceRef.current.d3Force("charge").strength(repelStrength);
    forceRef.current.d3Force("center");
  });

  return (
    <BrowserRouter>
      <ChronoLogNavBar />
      <div class="chronolog-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <img src="../ChronoLogo.png" class="img-fluid" alt="ChronoLogo" />
        <div class="about-chronolog">
          <p>Beautiful data.</p>
        </div>
      </div>
      <div className="App">
        <div className="Graph">
          <ForceGraph2D
            graphData={data[counter]}
            minZoom={5}
            maxZoom={10}
            nodeLabel="name"
            linkCurvature="curvature"
            linkWidth="value"
            linkDirectionalParticleWidth={1}
            width={displayWidth}
            height={displayHeight}
            onEngineStop={() => {
              forceRef.current.zoomToFit(0, padding);
            }}
            ref={forceRef}
            nodeAutoColorBy={"name"}
          />
        </div>
        <div className="Timeline">
          <TimelineNavigaion
            maxval={data.length - 1}
            setCounter={setCounter}
            TimelineNavigaion
          />
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/:book" element={<Graph />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
