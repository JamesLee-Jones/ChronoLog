import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./App.css";
import {
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

function MetadataNodeCard({
  node,
  firstInteraction,
  betweenness_centrality,
  subgraph_centrality,
  degree_centraility,
}) {
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
              {node.name ? node.name : "Select a Character"}
              <span> </span>
              <CircleIcon
                sx={{ color: node.color, textAlign: "right", fontSize: 25 }}
              ></CircleIcon>
            </Typography>
          </>
        }
      ></CardHeader>
      <Divider></Divider>
      <CardActions>
        <Typography sx={{ fontSize: 18, textAlign: "left", p: 1 }}>
          First Interaction
        </Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography
            sx={{ fontSize: 14, textAlign: "left" }}
            color="text.secondary"
            gutterBottom
          >
            {firstInteraction && node.name
              ? node.name + " interacts first with " + firstInteraction.with
              : "No interactions to display"}
          </Typography>
          <Typography sx={{ fontSize: 14, fontStyle: "italic" }}>
            {firstInteraction ? '"' + firstInteraction.context + '"' : ""}
          </Typography>
        </CardContent>
      </Collapse>
      <CardActions>
        <Typography sx={{ fontSize: 18, textAlign: "left", p: 1 }}>
          More Metrics
        </Typography>
        <ExpandMore
          expand={expanded2}
          onClick={handleExpandClick2}
          aria-expanded={expanded2}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded2} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography
            sx={{ fontSize: 14, textAlign: "left" }}
            color="text.secondary"
            gutterBottom
          >
            {betweenness_centrality !== undefined
              ? "Betweenness Centrality: " + betweenness_centrality
              : "Betweenness Centrality: - "}
            <span> </span>
          </Typography>

          <Typography
            sx={{ fontSize: 14, textAlign: "left" }}
            color="text.secondary"
            gutterBottom
          >
            {subgraph_centrality !== undefined
              ? "Subgraph Centrality: " + subgraph_centrality
              : "Subgraph Centrality: - "}
            <span> </span>
          </Typography>

          <Typography
            sx={{ fontSize: 14, textAlign: "left" }}
            color="text.secondary"
            gutterBottom
          >
            {degree_centraility !== undefined
              ? "Degree Centrality: " + degree_centraility
              : "Degree Centrality: - "}
            <span> </span>
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default MetadataNodeCard;
