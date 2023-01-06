import React, {useEffect, useState, useRef} from "react";
import "./App.css";
import {Button, IconButton} from "@mui/material";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import CircleIcon from '@mui/icons-material/Circle';
import {ForceGraph2D} from "react-force-graph";
import * as d3 from "d3";

// function HomePage() {
//   const [active1, setActive1] = useState(false);
//   const [active2, setActive2] = useState(false);
//
//   const [active3, setActive3] = useState(false);
//
//   const [active4, setActive4] = useState(false);
//
//   const [active5, setActive5] = useState(false);
//
//   const buttonColor1 = () => {
//     setActive1(!active1);
//   };
//
//   const buttonColor2 = () => {
//     setActive2(!active3);
//   };
//
//   const buttonColor3 = () => {
//     setActive3(!active3);
//   };
//
//   const buttonColor4 = () => {
//     setActive4(!active4);
//   };
//
//   const buttonColor5 = () => {
//     setActive5(!active5);
//   };
//
//   return (
//     <div className="container py-4">
//       <header class="p-5 mb-4">
//         <div className="p mb-4 rounded-3">
//           <div className="container-fluid py-5">
//             <h1 className="title">ChronoLog.</h1>
//             <Button
//               onClick={buttonColor1}
//               id="button"
//               className="rounded-circle"
//               style={{
//                 backgroundColor: active1 ? "#22333b" : "#CDCCCA",
//                 borderColor: active1 ? "#22333b" : "#CDCCCA",
//               }}
//             >
//               I
//             </Button>
//             <Button
//               onClick={buttonColor2}
//               id="button2"
//               className="rounded-circle"
//               style={{
//                 backgroundColor: active2 ? "#22333b" : "#CDCCCA",
//                 borderColor: active2 ? "#22333b" : "#CDCCCA",
//               }}
//             >
//               II
//             </Button>
//             <Button
//               onClick={buttonColor3}
//               id="button3"
//               className="rounded-circle"
//               style={{
//                 backgroundColor: active3 ? "#22333b" : "#CDCCCA",
//                 borderColor: active3 ? "#22333b" : "#CDCCCA",
//               }}
//             >
//               III
//             </Button>
//             <Button
//               onClick={buttonColor4}
//               id="button4"
//               className="rounded-circle"
//               style={{
//                 backgroundColor: active4 ? "#22333b" : "#CDCCCA",
//                 borderColor: active4 ? "#22333b" : "#CDCCCA",
//               }}
//             >
//               IV
//             </Button>
//             <Button
//               onClick={buttonColor5}
//               id="button5"
//               className="rounded-circle"
//               style={{
//                 backgroundColor: active5 ? "#22333b" : "#CDCCCA",
//                 borderColor: active5 ? "#22333b" : "#CDCCCA",
//               }}
//             >
//               V
//             </Button>
//           </div>
//         </div>
//       </header>
//     </div>
//   );
// }


export default HomePage;

function HomePage() {

    // const [buttonEnabled, setButtonState] = useState({0: false, 1: false, 2: false, 3: false, 4: false});
    //
    // const selectButton = (id) => {
    //     let newState = buttonEnabled
    //     newState[id] = !buttonEnabled[id]
    //     setButtonState(newState)
    //     // console.log(buttonEnabled)
    //     // if newState[id]:
    //     // document.getElementById(String(id)).style.backgroundColor = "#22333b"
    // };

    const buttons = [
        {id: 0, title: "I"},
        {id: 1, title: "II"},
        {id: 2, title: "III"},
        {id: 3, title: "IV"},
        {id: 4, title: "V"}
    ];

    const [selected, setSelected] = useState(0);
    const [state, setState] = useState({
        color: "blue"
    });

    const handleColor = (row) => {
        setSelected(row.id);
    };

    const selectLeft = (row_id) => {
        setSelected(((row_id - 1) + 5) % 5);
    }

    const selectRight = (row_id) => {
        setSelected((row_id + 1) % 5);
    }

    useEffect(() => {
        document.body.style.backgroundColor = "#F5EEE2";
    });

    let node = [
        {id: "id1", name: "Harry", val: "3"},
        {id: "id2", name: "Ron", val: "3"},
        {id: "id3", name: "Hermione", val: "3"},
        {id: "id4", name: "Dumbledore", val: "3"},
        {id: "id5", name: "Snape", val: "3"},
        {id: "id6", name: "Dobby", val: "3"},
        {id: "id7", name: "Draco", val: "3"},
        {id: "id8", name: "Neville", val: "3"},

    ];

    let link = [
        {source: "id1", target: "id4"},
        {source: "id2", target: "id3"},
        {source: "id2", target: "id4"},
        {source: "id3", target: "id4"},
        {source: "id4", target: "id5"},
        {source: "id4", target: "id6"},
        {source: "id4", target: "id7"},
        {source: "id5", target: "id8"},
    ];

    const width = 1000;
    const height = 300;

    const forceRef = useRef();

    useEffect(() => {
        forceRef.current.d3Force("charge", d3.forceManyBody().strength(-100));
        forceRef.current.d3Force("center", d3.forceCenter(0, 0));
        forceRef.current.d3Force("collide", d3.forceCollide());
        forceRef.current.d3Force("y", d3.forceY(-10));
        forceRef.current.d3Force("x", d3.forceX(-10));
    }, []);

    return (
        <>
            <main className="container" id="chronolog-header" role="main">
                <div className="row justify-content-start">
                    <div className="col-4">
                        <img src="../ChronoLogoTransparent.png" className="img-fluid" alt="ChronoLogo"/>
                    </div>
                    <div className="col-8 homeGraph">
                        <ForceGraph2D
                            graphData={{nodes: node, links: link}}
                            nodeLabel="name"
                            linkWidth={4}
                            linkDirectionalParticleWidth={4}
                            nodeAutoColorBy={"name"}
                            width={width}
                            height={height}
                            ref={forceRef}
                            enablePanInteraction={true}
                            enableZoomInteraction={true}
                        />
                    </div>
                </div>
                <div className="about-chronolog">
                    <p>Beautiful data.</p>
                </div>
            </main>
            <div className="container">
                <div className="row text-center">
                    <div className="col-sm text-center">
                        <Button style={{backgroundColor: "#22333b"}}>
                            <KeyboardArrowLeft style={{color: "#eae0d5"}} onClick={() => selectLeft(selected)}/>
                        </Button>
                    </div>
                    {buttons.map((list) => (
                        <div className="col-sm text-center">
                            {/*<Button variant="outlined"*/}
                            {/*        id={list.id}*/}
                            {/*        onClick={() => handleColor(list)}*/}
                            {/*        style={{*/}
                            {/*            borderRadius: 8,*/}
                            {/*            backgroundColor: list.id === selected ? "#22333b" : "#eae0d5",*/}
                            {/*            borderColor: list.id === selected ? "#22333b" : "#eae0d5"*/}
                            {/*        }}*/}
                            {/*>*/}
                            {/*    {list.title}*/}
                            {/*</Button>*/}
                            <IconButton>
                                <CircleIcon variant="outlined"
                                            id={list.id}
                                            onClick={() => handleColor(list)}
                                            style={{
                                                color: list.id === selected ? "#22333b" : "#eae0d5",
                                                borderColor: list.id === selected ? "#22333b" : "#eae0d5"
                                            }}>
                                </CircleIcon>
                            </IconButton>
                        </div>

                    ))}
                    <div className="col-sm text-center">
                        <Button style={{backgroundColor: "#22333b"}}>
                            <KeyboardArrowRight style={{color: "#eae0d5"}} onClick={() => selectRight(selected)}/>
                        </Button>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col-sm">
                    </div>
                    {buttons.map((list) => (
                        <div className="col-sm text-center">
                            <Typography>
                                {list.title}
                            </Typography>

                        </div>

                    ))}
                    <div className="col-sm">
                    </div>
                </div>
            </div>

        </>

    );


    // return (
    //     <div className="container py-4">
    //         <header class="p-5 mb-4">
    //             <IconButton onClick={() => selectButton("0")} aria-label="delete" id="0"
    //                         className="rounded-circle"
    //                         style={{
    //                             backgroundColor: buttonEnabled["0"] === true ? "#22333b" : "#CDCCCA",
    //                             borderColor: buttonEnabled["0"] === true ? "#22333b" : "#CDCCCA",
    //                         }}>
    //                 <DeleteIcon/>
    //             </IconButton>
    //             {/*<IconButton onClick={selectButton} aria-label="delete" id="button2"*/}
    //             {/*            className="rounded-circle"*/}
    //             {/*            style={{*/}
    //             {/*                backgroundColor: buttonEnabled ? "#22333b" : "#CDCCCA",*/}
    //             {/*                borderColor: buttonEnabled ? "#22333b" : "#CDCCCA",*/}
    //             {/*            }}>*/}
    //             {/*    <DeleteIcon/>*/}
    //             {/*</IconButton>*/}
    //             {/*<IconButton onClick={selectButton} aria-label="delete" id="button3"*/}
    //             {/*            className="rounded-circle"*/}
    //             {/*            style={{*/}
    //             {/*                backgroundColor: buttonEnabled ? "#22333b" : "#CDCCCA",*/}
    //             {/*                borderColor: buttonEnabled ? "#22333b" : "#CDCCCA",*/}
    //             {/*            }}>*/}
    //             {/*    <DeleteIcon/>*/}
    //             {/*</IconButton>*/}
    //             {/*<IconButton onClick={selectButton} aria-label="delete" id="button4"*/}
    //             {/*            className="rounded-circle"*/}
    //             {/*            style={{*/}
    //             {/*                backgroundColor: buttonEnabled ? "#22333b" : "#CDCCCA",*/}
    //             {/*                borderColor: buttonEnabled ? "#22333b" : "#CDCCCA",*/}
    //             {/*            }}>*/}
    //             {/*    <DeleteIcon/>*/}
    //             {/*</IconButton>*/}
    //             {/*<IconButton onClick={selectButton} aria-label="delete" id="button5"*/}
    //             {/*            className="rounded-circle"*/}
    //             {/*            style={{*/}
    //             {/*                backgroundColor: buttonEnabled ? "#22333b" : "#CDCCCA",*/}
    //             {/*                borderColor: buttonEnabled ? "#22333b" : "#CDCCCA",*/}
    //             {/*            }}>*/}
    //             {/*    <DeleteIcon/>*/}
    //             {/*</IconButton>*/}
    //         </header>
    //     </div>
    // );

}
