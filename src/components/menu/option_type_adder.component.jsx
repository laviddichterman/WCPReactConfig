import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import CheckedInputComponent from "../checked_input.component";


import { useAuth0 } from "../../react-auth0-spa";

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


const OptionTypeAdderComponent = ({ ENDPOINT, option_types, options }) => {
  const classes = useStyles();
  //
  const [ordinalOT, setOrdinalOT] = useState(0);
  const [nameOT, setNameOT] = useState("");
  const [selectionTypeOT, setSelectionTypeOT] = useState("MANY");
  const [revelIDOT, setRevelIDOT] = useState("");
  const [squareIDOT, setSquareIDOT] = useState("");
  const [isProcessingAddOptionType, setIsProcessingAddOptionType] = useState(
    false
  );

  const { getTokenSilently } = useAuth0();

  const addOptionType = async (e) => {
    e.preventDefault();

    if (!isProcessingAddOptionType) {
      setIsProcessingAddOptionType(true);
      try {
        const token = await getTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/option/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nameOT,
            ordinal: ordinalOT,
            selection_type: selectionTypeOT,
            revelID: revelIDOT,
            squareID: squareIDOT,
          }),
        });
        console.log(JSON.stringify(response));
        setOrdinalOT(0);
        setNameOT("");
        setSelectionTypeOT("MANY");
        setRevelIDOT("");
        setSquareIDOT("");
        setIsProcessingAddOptionType(false);
      } catch (error) {
        console.error(error);
        setIsProcessingAddOptionType(false);
      }
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="subtitle1" className={classes.title}>
                  Create a Option/Modifier Type:
                </Typography>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Option Type Name"
              type="text"
              inputProps={{ size: 20 }}
              value={nameOT}
              size="small"
              onChange={(e) => setNameOT(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Selection Type</FormLabel>
              <RadioGroup
                row
                defaultValue="SINGLE"
                aria-label="selection-type"
                name="selection-type"
                value={selectionTypeOT}
                onChange={e=> setSelectionTypeOT(e.target.value)}
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
          <Grid item xs={6}>
            <CheckedInputComponent
                label="Ordinal"
                type="number"
                fullWidth
                checkFunction={CheckForNumberGEZeroLT64Int}
                value={ordinalOT}
                inputProps={{min:0, max:63}}
                onFinishChanging={(e) => setOrdinalOT(e)}
              />
          </Grid>
          <Grid item xs={6}>
            <Button
              className="btn btn-light"
              onClick={addOptionType}
              disabled={nameOT.length === 0}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default OptionTypeAdderComponent;
