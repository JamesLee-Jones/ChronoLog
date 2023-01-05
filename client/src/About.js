import React, { useEffect } from "react";
import "./App.css";
import "./Library.css";
import "./About.css";
import { Link } from "react-scroll";
import AboutGraph from "./about_page_components/AboutGraph";
import AboutGraphAdv from "./about_page_components/AboutGraphAdv";
import AboutNavigation from "./about_page_components/AboutNavigation";
import AboutMetadata from "./about_page_components/AboutMetadata";

function About() {
  useEffect(() => {
    document.body.style.backgroundColor = "#eae0d5";
  });

  return (
    <div className="about">
      <div className="sidebar">
        <h4>Table of Contents</h4>
        <nav>
          <li>
            <Link activeClass="active" spy to="chronolog">
              What is Chronolog?
            </Link>
          </li>
          <li>
            <Link activeClass="active" spy to="graphs">
              ChronoLog's Graphs
            </Link>
          </li>
          <li>
            <Link activeClass="active" spy to="graph_stats">
              ChronoLog's Card Statistics
            </Link>
          </li>
          <li>
            <Link activeClass="active" spy to="using_tool">
              ChronoLog Viz
            </Link>
          </li>
        </nav>
      </div>

      <section id="chronolog">
        <h2>What is ChronoLog?</h2>
        <p>
          Novels often contain many places, characters and organisations each
          with their own unique names. As the plot thickens, it can become
          difficult to keep track of each character and how their interactions
          within their fictional world evolve.
        </p>

        <p>
          ChronoLog aims to make this easier by generating a timeline of where
          people are at what times using a state-of-the-art natural language
          processing tool{" "}
          <a href="https://spacy.io/" target="_blank" rel="noopener noreferrer">
            spaCy
          </a>
          .
        </p>

        <p>
          This page will give you a quick overview of the features ChronoLog
          provides.
        </p>
      </section>
      <section id="graphs">
        <h2>Understanding ChronoLog's Graphs</h2>

        <p>
          ChronoLog's graphs provide you with an interactive graph to see the
          characters that appear in a selected book:
        </p>

        <div className="graph_node_demo">
          <div className="example_graph_1">
            <AboutGraph></AboutGraph>
          </div>

          <div className="graph_explaination_1">
            <h3>Nodes</h3>
            <p>
              Each node represents a unique character present in a given section
              of the book
            </p>
            <p>Hovering over a node will show you the name of the character</p>
            <p>
              You can hold and drag nodes around to change the layout of the
              graph (or just have fun xD)
            </p>
            <p>
              Clicking a node will give you some more detail about the selected
              character (see ChronoLog's Card Statistics)
            </p>
          </div>
        </div>

        <div className="graph_link_demo">
          <div className="example_graph_2">
            <AboutGraphAdv></AboutGraphAdv>
          </div>

          <div className="graph_explaination_2">
            <h3>Links</h3>
            <p>
              Each link represents the average strength of interaction between
              two characters
            </p>
            <p>
              Solid Links denote strong connections while Dashed Links denote
              weak connections
            </p>
            <p>
              By clicking a node, the links change showing only the selected
              character interaction with all its connections (Try it yourself!){" "}
            </p>
            <p>
              Clicking a link will give you some more detail about the link
              between two characters (see ChronoLog's Card Statistics)
            </p>
          </div>
        </div>

        <div className="graph_node_demo">
          <div className="example_slider">
            <AboutNavigation></AboutNavigation>
          </div>

          <div className="graph_explaination_1">
            <h3>Navigating and Editing the Graph</h3>
            <p>
              Sliders are the main way to navigate to different sections of the
              book
            </p>
            <p>
              You can also use the buttons provided to go forward, backward or
              even play through each section
            </p>
            <p>
              Sometimes the graph can become very cluttered so you can use the
              pruning slider to reduce the number of characters shown
            </p>
            <p>
              Characters will be removed in order of importance, starting with
              the least important character
            </p>
          </div>
        </div>
      </section>
      <section id="graph_stats">
        <h2>ChronoLog's Card Statistics</h2>

        <p>
          ChronoLog provides an in-depth analysis of the graph it produces and
          displays this using cards:
        </p>

        <div className="card_demo">
          <div className="about_card">
            <AboutMetadata></AboutMetadata>
          </div>

          <div className="graph_explaination_1">
            <p>
              ChronoLog has many cards that show information when you navigate
              through different sections or click on a node/link
            </p>
            <p>
              This card to the left is an example of what you might see when
              clicking 'Lily' on one of the graphs above
            </p>
            <p>
              Each card has different sections containing statistics, sentences
              from the book and interesting facts. Use the arrow to toggle these
              as you wish
            </p>
          </div>
        </div>

        <h3>Card Statistics</h3>
        <p>
          Please read this comprehensive guide to understand the metrics that
          ChronoLog provides:
        </p>

        <ul>
          <li>
            <text style={{ fontWeight: "bold" }}>Average Clustering</text>
          </li>
          <p>
            A measure of the degree to which nodes in a graph tend to cluster
            together. In this context, the average clustering coefficient of the graph would be a measure of the
            degree to which the characters tend to form groups or cliques. A value of 0 indicates that the characters do
            not tend to cluster together at all, while a value of 1 indicates that the characters are
            highly interconnected and tend to form a large number of triangles.
          </p>
          <li>
            <text style={{ fontWeight: "bold" }}>Degree Centrallity</text>
          </li>
          <p>
            How many direct, 'one hop' connections each node has to other nodes
            in the graph. It is a measure of a node's influence based on the number of edges incident on it. This would
            represent how important a character is based on how many characters they interact with. We used this metric
            to determine who the most important character is.
          </p>
           <li>
            <text style={{ fontWeight: "bold" }}>Betweenness Centrallity</text>
          </li>
          <p>
            The betweenness centrality of a node in a graph represents the number of times the node lies on the shortest
            between two other nodes. For every character this is would be a measure of how often they are involved in
            the interactions between other characters.
          </p>
          <p>
            A character with a high betweenness centrality might be considered a 'mediator' who connects different
            groups of characters and plays a key role in facilitating communication and interactions between them. On the
            other hand, a character with a low betweenness centrality might be more isolated and have fewer connections
            to other characters.
          </p>
            <li>
            <text style={{ fontWeight: "bold" }}>Subgraph Centrality</text>
          </li>
          <p>
            The subgraph centrality of a node is a measure of it's importance in terms of the size and density of the
            subgraph induced by it's neighbours. The subgraph centrality of that character would be a measure of their
            importance in terms of the size and density of the group of characters they are connected to. Characters
            with a high subgraph centrality might be thought of as being at the center of a large, tightly-knit group of
            characters.
          </p>
          <li>
            <text style={{ fontWeight: "bold" }}>First Interaction</text>
          </li>
          <p>The first interaction a selected character engaged in </p>
          <li>
            <text style={{ fontWeight: "bold" }}>
              First Interaction between Characters
            </text>
          </li>
          <p>The first interaction a pair of characters engaged in </p>
        </ul>
      </section>
      <section id="using_tool">
        <h2> Chronolog Viz </h2>

        <p>
          Can't find what you are looking for in the library? ChronoLog Viz
          allows you to run ChronoLog on a book and bring it to life! Please use
          the guide below to get started:
        </p>

        <div style={{ placeItems: "center" }}>
          <text style={{ fontWeight: "bold" }}> Coming Soon</text>
        </div>
      </section>
    </div>
  );
}

export default About;
