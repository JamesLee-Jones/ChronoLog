import React, {useState} from "react";
import "./App.css";
import {Button, IconButton, SvgIcon} from "@mui/material";
import {Circle, KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import CircleIcon from '@mui/icons-material/Circle';

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

    return (
        <>
            <div className="chronolog-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                <img src="../ChronoLogo.png" className="img-fluid" alt="ChronoLogo"/>
                <div className="about-chronolog">
                    <p>Beautiful data.</p>
                </div>
            </div>
            <div className="container">
                <div className="row text-center">
                    <div className="col-sm text-center">
                        <Button>
                            <KeyboardArrowLeft onClick={() => selectLeft(selected)}/>
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
                            style={{color: list.id === selected ? "#22333b" : "#eae0d5",
                            borderColor: list.id === selected ? "#22333b" : "#eae0d5"}}>
                            </CircleIcon>
                            </IconButton>
                        </div>

                    ))}
                    <div className="col-sm text-center">
                        <Button>
                            <KeyboardArrowRight onClick={() => selectRight(selected)}/>
                        </Button>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col-sm">
                    </div>
                    {buttons.map((list) => (
                        <div className="col-sm text-center">
                            <Typography style={{fontFamily: 'Baskerville'}}>
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
