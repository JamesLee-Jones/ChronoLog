import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./App.css";
import {
  Avatar,
  CardHeader,
  Collapse,
  Divider,
  IconButton,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function MetadataAnalysisCard({ graphAttributes }) {
  const [expanded, setExpanded] = React.useState(false);
  const [expanded2, setExpanded2] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandClick2 = () => {
    setExpanded2(!expanded2);
  };

  return (
    <Card
      sx={{ bgcolor: "background.paper", boxShadow: 1, borderRadius: 2, p: 1 }}
      variant="outlined"
    >
      <CardHeader
        title={
          <>
            <Typography
              sx={{ fontSize: 20, textAlign: "left" }}
              color="text.primary"
              gutterBottom
            >
              {graphAttributes
                ? "Average Clustering: " + graphAttributes.average_clustering
                : "Select a Section"}
              <span> </span>
            </Typography>
          </>
        }
      ></CardHeader>
      <Divider></Divider>
      <CardContent>
        <Typography
          sx={{ fontSize: 14, textAlign: "left" }}
          color="text.secondary"
          gutterBottom
        >
          {graphAttributes
            ? "Most Important Character: " +
              graphAttributes.most_important_character
            : "Select a Section"}
          <span> </span>
        </Typography>
        <Typography
          sx={{ fontSize: 14, textAlign: "left" }}
          color="text.secondary"
          gutterBottom
        >
          {graphAttributes
            ? "Degree of Most Important Character: " +
              graphAttributes.degree_of_mic
            : "Select a Section"}
          <span> </span>
        </Typography>
        <Typography
          sx={{ fontSize: 14, textAlign: "left" }}
          color="text.secondary"
          gutterBottom
        >
          {graphAttributes
            ? "Degree Centrality of Most Important Character: " +
              graphAttributes.degree_centrality_mic
            : "Select a Section"}
          <span> </span>
        </Typography>
        <Typography
          sx={{ fontSize: 14, textAlign: "left" }}
          color="text.secondary"
          gutterBottom
        >
          {graphAttributes
            ? "Average Degree Centrality: " +
              graphAttributes.avg_degree_centrality
            : "Select a Section"}
          <span> </span>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MetadataAnalysisCard;
