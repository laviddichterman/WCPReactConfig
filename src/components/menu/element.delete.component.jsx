import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Warning } from "@material-ui/icons";


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  title: {
    flexGrow: 1,
  },
  listLevel0: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  listLevel1: {
    paddingLeft: theme.spacing(4),
  },
}));

const ElementDeleteComponent = ({ 
  name,
  actions}) => {
  const classes = useStyles();

  const actions_html = actions.length === 0 ? "" : 
    (<Grid container justify="flex-end" item xs={12}>
      {actions.map((action, idx) => (
        <Grid item key={idx}>
          {action}
        </Grid>
      ))}
    </Grid>);
    
  return (
    <div className={classes.root}>
      <Grid container spacing={3} justify="center">
        <Grid item xs={12}>
          <Warning />Are you sure you'd like to delete {name}? Note this cannot be undone.
        </Grid>
        {actions_html}
      </Grid>
    </div>
  );
};

export default ElementDeleteComponent;
