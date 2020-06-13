import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Switch from "@material-ui/core/Switch";
import Autocomplete from "@material-ui/lab/Autocomplete";
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

const ModifierOptionComponent = ({
  actions,
  modifier_types,
  displayName,
  setDisplayName,
  description,
  setDescription,
  shortcode,
  setShortcode,
  ordinal,
  setOrdinal,
  price,
  setPrice,
  enableFunctionName,
  setEnableFunctionName,
  flavorFactor,
  setFlavorFactor,
  bakeFactor,
  setBakeFactor,
  canSplit,
  setCanSplit,
  enabled,
  setEnabled,
  revelID,
  setRevelID,
  squareID,
  setSquareID,
  parent, setParent, 
  parentName, setParentName
}) => {
  const classes = useStyles();
  const actions_html =
    actions.length === 0 ? (
      ""
    ) : (
      <Grid container justify="flex-end" item xs={12}>
        {actions.map((action) => (
          <Grid item key={action}>
            {action}
          </Grid>
        ))}
      </Grid>
    );

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justify="center">
        <Grid item xs={6}>
          <Autocomplete
            options={modifier_types}
            value={parent}
            onChange={(e, v) => setParent(v)}
            inputValue={parentName}
            onInputChange={(e, v) => setParentName(v)}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField {...params} label="Modifier Type" />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Display Name"
            type="text"
            inputProps={{ size: 40 }}
            value={displayName}
            size="small"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Description"
            type="text"
            inputProps={{ size: 40 }}
            value={description}
            size="small"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Short Code"
            type="text"
            inputProps={{ size: 40 }}
            value={shortcode}
            size="small"
            onChange={(e) => setShortcode(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Price"
            type="text"
            inputProps={{ size: 10 }}
            value={price}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Enable Function Name"
            type="text"
            inputProps={{ size: 40 }}
            value={enableFunctionName}
            size="small"
            onChange={(e) => setEnableFunctionName(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <CheckedInputComponent
            label="Ordinal"
            type="number"
            fullWidth
            checkFunction={CheckForNumberGEZeroLT64Int}
            value={ordinal}
            inputProps={{ min: 0, max: 63 }}
            onFinishChanging={(e) => setOrdinal(e)}
          />
        </Grid>
        <Grid item xs={4}>
          <CheckedInputComponent
            label="Flavor Factor"
            type="number"
            fullWidth
            checkFunction={CheckForNumberGEZeroLT64Int}
            value={flavorFactor}
            inputProps={{ min: 0 }}
            onFinishChanging={(e) => setFlavorFactor(e)}
          />
        </Grid>
        <Grid item xs={4}>
          <CheckedInputComponent
            label="Bake Factor"
            type="number"
            fullWidth
            checkFunction={CheckForNumberGEZeroLT64Int}
            value={bakeFactor}
            inputProps={{ min: 0 }}
            onFinishChanging={(e) => setBakeFactor(e)}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Switch checked={enabled} onChange={e => setEnabled(e.target.checked)} name="Enabled" />
            }
            label="Enabled"
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Switch
                checked={canSplit}
                onChange={e => setCanSplit(e.target.checked)}
                name="Can Split"
              />
            }
            label="Can Split"
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

export default ModifierOptionComponent;
