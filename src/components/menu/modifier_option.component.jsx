import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckedInputComponent from "../checked_input.component";
import DatetimeBasedDisableComponent from "../datetime_based_disable.component";

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

const ModifierOptionComponent = ({
  actions,
  progress,
  product_instance_functions,
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
  enableFunction,
  setEnableFunction,
  flavorFactor,
  setFlavorFactor,
  bakeFactor,
  setBakeFactor,
  canSplit,
  setCanSplit,
  omitFromShortname,
  setOmitFromShortname,
  disabled,
  setDisabled,
  revelID,
  setRevelID,
  squareID,
  setSquareID,
}) => {
  const classes = useStyles();
  const actions_html =
    actions.length === 0 ? (
      ""
    ) : (
      <Grid container justify="flex-end" item xs={12}>
        {actions.map((action, idx) => (
          <Grid item key={idx}>
            {action}
          </Grid>
        ))}
      </Grid>
    );

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justify="center">
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
            fullWidth
            inputProps={{ size: 40 }}
            value={description}
            size="small"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Short Code"
            type="text"
            inputProps={{ size: 40 }}
            value={shortcode}
            size="small"
            onChange={(e) => setShortcode(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <CheckedInputComponent
              label="Price"
              fullWidth={false}
              className="form-control"
              type="number"
              size="small"
              parseFunction={(e) => parseFloat(e).toFixed(2)}
              value={price}
              inputProps={{min:0.00}}
              onFinishChanging={(e) => setPrice(e)}
            />
        </Grid>
        <Grid item xs={2}>
          <CheckedInputComponent
            label="Ordinal"
            type="number"
            value={ordinal}
            inputProps={{ min: 0 }}
            onFinishChanging={(e) => setOrdinal(e)}
          />
        </Grid>
        <Grid item xs={2}>
          <CheckedInputComponent
            label="Flavor Factor"
            type="number"
            fullWidth
            value={flavorFactor}
            parseFunction={parseFloat}
            inputProps={{ min: 0, max: 63 }}
            onFinishChanging={(e) => setFlavorFactor(e)}
          />
        </Grid>
        <Grid item xs={2}>
          <CheckedInputComponent
            label="Bake Factor"
            type="number"
            fullWidth
            value={bakeFactor}
            parseFunction={parseFloat}
            inputProps={{ min: 0, max: 63 }}
            onFinishChanging={(e) => setBakeFactor(e)}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            style={{ width: 300 }}
            options={product_instance_functions}
            value={enableFunction}
            onChange={(e, v) => setEnableFunction(v)}
            getOptionLabel={(option) => option?.name ?? "CORRUPT DATA" }
            getOptionSelected={(option, value) =>
              option &&
              value &&
              option._id === value._id
            }
            renderInput={(params) => <TextField {...params} label="Enable Function Name" />}
          />
        </Grid>
        <Grid item xs={3}>
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
        <Grid item xs={3}>
          <FormControlLabel
            control={
              <Switch
                checked={omitFromShortname}
                onChange={e => setOmitFromShortname(e.target.checked)}
                name="Omit from shortname"
              />
            }
            label="Omit from shortname"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Revel ID"
            type="text"
            inputProps={{ size: 40 }}
            value={revelID}
            size="small"
            onChange={(e) => setRevelID(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Square ID"
            type="text"
            inputProps={{ size: 40 }}
            value={squareID}
            size="small"
            onChange={(e) => setSquareID(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <DatetimeBasedDisableComponent
            disabled={disabled}
            setDisabled={setDisabled}
          />
        </Grid>

        {actions_html}
        {progress}
      </Grid>
    </div>
  );
};

export default ModifierOptionComponent;
