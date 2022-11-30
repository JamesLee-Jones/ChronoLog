import React, {useEffect, useState} from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TimelineNavigation from "./Slider";
import {useParams} from "react-router-dom";
import Graphs from "./Graphs";
import MetadataCard from "./MetadataCard";

function convertData(data) {
    return {
        book: data["book"],
        num_sections: data["num_sections"],
        sections: data["sections"],
        first_interactions_between_characters:
            data["first_interactions_between_characters"],
        first_interaction: data["first_interactions_overall"],
    };
}

function BookVisualisation() {
    const [data, setData] = useState({
        book: "",
        num_sections: 0,
        sections: [],
        first_interactions_between_characters: {},
        first_interaction: {},
    });
    const [counter, setCounter] = useState(0);
    const [node, setNode] = useState({});
    const [link, setLink] = useState({});

    // Fetches data outputted by the backend
    const params = useParams();

    const getData = () => {
        fetch(params.book + ".json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                let res = convertData(myJson);
                setData(res);
            });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <div className="bookViz">
                <h1>
                    {data.book
                        .toLowerCase()
                        .split("_")
                        .map((word) => {
                            return word.charAt(0).toUpperCase() + word.slice(1);
                        })
                        .join(" ")}
                </h1>
                <div className="App">
                    <Graphs
                        graphData={data["sections"]}
                        nodeMetadata={{first_interaction: data["first_interaction"]}}
                        linkMetadata={{first_interactions_between_characters: data["first_interactions_between_characters"]}}
                        counter={counter}
                        setNode={setNode}
                        setLink={setLink}
                    ></Graphs>

                    <TimelineNavigation
                        maxval={data["sections"].length ? data["sections"].length - 1 : 0}
                        setCounter={setCounter}
                        counter={counter}
                        TimelineNavigation
                    />
                </div>
            </div>
            <div className="metadata">
                <MetadataCard node={node} firstInteraction={node.First_Interaction}/>
            </div>
        </>
    );
}

export default BookVisualisation;
