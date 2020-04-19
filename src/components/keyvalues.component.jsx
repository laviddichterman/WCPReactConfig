import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5)
    }
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  title: {
    flexGrow: 1
  }
}));

const KeyValuesComponent = ({
  KEYVALUES,
  onRemoveKeyValuePair,

  onAddNewKeyValuePair,
  onSubmit
}) => {
  const [newkey, setNewkey] = useState("");
  const [newvalue, setNewvalue] = useState("");
  const classes = useStyles();
  const onAddNewKeyValuePairLocal = () => {
    if (newkey) {
      onAddNewKeyValuePair(newkey, newvalue);
    }
    setNewkey("");
    setNewvalue("");
  };
  const key_values_html = Object.keys(KEYVALUES).map((k, i) => {
    return (
      <Paper key={i} spacing={3}>
        <Grid container>
          <Grid item xs={3}>
            {k}
          </Grid>
          <Grid item xs={7}>
            {KEYVALUES[k]}
          </Grid>
          <Grid item xs={2}>
            <IconButton
              edge="end"
              size="small"
              aria-label="delete"
              onClick={() => onRemoveKeyValuePair(k)}
            >
              <HighlightOffIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="subtitle1" className={classes.title}>
                  Key Value Store (Use for authentication data, will cause
                  reboot of service)
                </Typography>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Key"
              type="text"
              size="small"
              onChange={e => setNewkey(e.target.value)}
              value={newkey}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth={true}
              label="Value"
              type="text"
              value={newvalue}
              size="small"
              onChange={e => setNewvalue(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={onAddNewKeyValuePairLocal}>Add</Button>
          </Grid>
        </Grid>
        {key_values_html}
        <Button onClick={onSubmit}>PUSH CHANGES</Button>
      </Paper>
    </div>
  );
};
export default KeyValuesComponent;
