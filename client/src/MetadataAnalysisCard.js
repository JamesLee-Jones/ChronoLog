import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./App.css";
import {
  CardHeader,
  Divider,
} from "@mui/material";

function MetadataAnalysisCard({ graphAttributes }) {

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
