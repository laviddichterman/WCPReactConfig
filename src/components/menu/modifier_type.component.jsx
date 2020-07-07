import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import CheckedInputComponent from "../checked_input.component";

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

const ModifierTypeComponent = ({
  actions,
  ordinal, setOrdinal,
  minSelected, setMinSelected,
  maxSelected, setMaxSelected,
  name, setName,
  revelID, setRevelID,
  squareID, setSquareID
 }) => {
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
            <TextField
              label="Modifier Type Name"
              type="text"
              fullWidth
              inputProps={{ size: 40 }}
              value={name}
              size="small"
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <CheckedInputComponent
                label="Ordinal"
                type="number"
                value={ordinal}
                inputProps={{min:0}}
                onFinishChanging={(e) => setOrdinal(e)}
              />
          </Grid>
          <Grid item xs={4}>
            <CheckedInputComponent
                label="Min Selected"
                type="number"
                value={minSelected}
                inputProps={{min:0, size: 10}}
                onFinishChanging={(e) => setMinSelected(e)}
              />
          </Grid>
          <Grid item xs={4}>
            <CheckedInputComponent
                label="Max Selected"
                type="number"
                value={maxSelected}
                allowEmpty
                inputProps={{size: 10, min: minSelected }}
                onFinishChanging={(e) => setMaxSelected(e)}
              />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Revel ID"
              type="text"
              inputProps={{ size: 20 }}
              value={revelID}
              size="small"
              onChange={(e) => setRevelID(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Square ID"
              type="text"
              inputProps={{ size: 20 }}
              value={squareID}
              size="small"
              onChange={(e) => setSquareID(e.target.value)}
            />
          </Grid>
        {actions_html}
      </Grid>
    </div>
  );
};

export default ModifierTypeComponent;
