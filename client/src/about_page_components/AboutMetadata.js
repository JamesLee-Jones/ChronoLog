import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

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

function AboutMetadata() {
  const [expanded] = React.useState(true);
  const [expanded2, setExpanded2] = React.useState(false);

  let node = { id: "id3", name: "Lily", val: 3, color: "#b2df8a" };

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
          Some Statistics
        </Typography>
        <ExpandMore
          expand={expanded}
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
          ></Typography>
          <Typography sx={{ fontSize: 14, fontStyle: "italic" }}>
            Here you will find some stats which Chronolog has analysed
          </Typography>
        </CardContent>
      </Collapse>
      <CardActions>
        <Typography sx={{ fontSize: 18, textAlign: "left", p: 1 }}>
          Details
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
          ></Typography>
          <Typography sx={{ fontSize: 14, fontStyle: "italic" }}>
            Here you will find extra details that ChronoLog has found
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default AboutMetadata;
