import React, {useEffect, useState} from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './App.css'
import {Avatar, CardHeader, Collapse, IconButton, styled} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircleIcon from '@mui/icons-material/Circle';

const ExpandMore = styled((props) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function MetadataCard({node, firstInteraction}) {

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{maxWidth: 200, bgcolor: 'background.paper',
            boxShadow: 1,
            borderRadius: 2,
            p: 2,
            minWidth: 300,}} variant="outlined">
            <CardHeader
                title={<><Typography sx={{fontSize: 24}} color="text.primary" gutterBottom>{node ? node.name : "\n"}<span>  </span>
                    <CircleIcon sx={{color: node.color, alignContent : "right"}}></CircleIcon></Typography></>}
                subheader={<Typography sx={{fontSize: 14}} color="text.secondary"
                                       gutterBottom>{firstInteraction ? firstInteraction.with : "No Interactions."}</Typography>}></CardHeader>
            <CardActions>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography>Hello!</Typography>
                </CardContent>
            </Collapse>

        </Card>
    );
}

export default MetadataCard;