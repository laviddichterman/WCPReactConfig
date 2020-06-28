import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
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

const CheckForNumberGEZeroLT64Int = (e) => {
  const parsed = parseInt(e);
  return isNaN(parsed) || parsed < 0 || parsed > 63 ? 1 : parsed;
};


const ModifierTypeComponent = ({
  actions,
  ordinal, setOrdinal,
  name, setName,
  selectionType, setSelectionType,
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
        <Grid item container xs={9}>
          <Grid item xs={12}>
            <TextField
              label="Modifier Type Name"
              type="text"
              inputProps={{ size: 40 }}
              value={name}
              size="small"
              onChange={(e) => setName(e.target.value)}
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
          <Grid item xs={7}>
          <CheckedInputComponent
              label="Ordinal"
              type="number"
              fullWidth
              checkFunction={CheckForNumberGEZeroLT64Int}
              value={ordinal}
              inputProps={{min:0, max:63}}
              onFinishChanging={(e) => setOrdinal(e)}
            />
        </Grid>
        </Grid>
        <Grid item xs={3}>
          <Grid container item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Selection Type</FormLabel>
              <RadioGroup
                defaultValue="SINGLE"
                aria-label="selection-type"
                name="selection-type"
                value={selectionType}
                onChange={e=> setSelectionType(e.target.value)}
              >
                <FormControlLabel
                  value="SINGLE"
                  control={<Radio />}
                  label="Single"
                />
                <FormControlLabel
                  value="MANY"
                  control={<Radio />}
                  label="Many"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        {actions_html}
      </Grid>
    </div>
  );
};

export default ModifierTypeComponent;
