import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Switch from "@material-ui/core/Switch";
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
  ordinal,
  setOrdinal,
  minSelected,
  setMinSelected,
  maxSelected,
  setMaxSelected,
  name,
  setName,
  displayName,
  setDisplayName,
  revelID,
  setRevelID,
  squareID,
  setSquareID,
  omitOptionIfNotAvailable,
  setOmitOptionIfNotAvailable,
  omitSectionIfNoAvailableOptions,
  setOmitSectionIfNoAvailableOptions,
  useToggleIfOnlyTwoOptions,
  setUseToggleIfOnlyTwoOptions,
  isHiddenDuringCustomization,
  setIsHiddenDuringCustomization,
  modifierClass,
  setModifierClass,
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
        <Grid item xs={12}>
          <TextField
            label="Display Name (Optional)"
            type="text"
            fullWidth
            inputProps={{ size: 40 }}
            value={displayName}
            size="small"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <CheckedInputComponent
            label="Ordinal"
            type="number"
            value={ordinal}
            inputProps={{ min: 0 }}
            onFinishChanging={(e) => setOrdinal(e)}
          />
        </Grid>
        <Grid item xs={4}>
          <CheckedInputComponent
            label="Min Selected"
            type="number"
            value={minSelected}
            inputProps={{ min: 0, size: 10 }}
            onFinishChanging={(e) => setMinSelected(e)}
          />
        </Grid>
        <Grid item xs={4}>
          <CheckedInputComponent
            label="Max Selected"
            type="number"
            value={maxSelected}
            allowEmpty
            inputProps={{ size: 10, min: minSelected }}
            onFinishChanging={(e) => setMaxSelected(e)}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={omitSectionIfNoAvailableOptions}
                onChange={(e) =>
                  setOmitSectionIfNoAvailableOptions(e.target.checked)
                }
                name="Omit Section If No Available Options"
              />
            }
            labelPlacement="top"
            label="Omit Section If No Available Options"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={omitOptionIfNotAvailable}
                onChange={(e) => setOmitOptionIfNotAvailable(e.target.checked)}
                name="Omit Option If Not Available"
              />
            }
            labelPlacement="top"
            label="Omit Option If Not Available"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                disabled={maxSelected !== 1 || minSelected !== 1}
                checked={useToggleIfOnlyTwoOptions}
                onChange={(e) => setUseToggleIfOnlyTwoOptions(e.target.checked)}
                name="Use Toggle If Only Two Options"
              />
            }
            labelPlacement="top"
            label="Use Toggle If Only Two Options"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={isHiddenDuringCustomization}
                onChange={(e) =>
                  setIsHiddenDuringCustomization(e.target.checked)
                }
                name="Hide from user customization"
              />
            }
            labelPlacement="top"
            label="Hide from user customization"
          />
        </Grid>
        <Grid container item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Modifier Class</FormLabel>
            <RadioGroup
              defaultValue="SINGLE"
              aria-label="selection-type"
              name="selection-type"
              row
              value={modifierClass}
              onChange={(e) => setModifierClass(e.target.value)}
            >
              <FormControlLabel
                value="ADD"
                control={<Radio />}
                label="Addition"
              />
              <FormControlLabel value="SIZE" control={<Radio />} label="Size" />
              <FormControlLabel
                value="SUB"
                control={<Radio />}
                label="Substitution"
              />
              <FormControlLabel
                value="REMOVAL"
                control={<Radio />}
                label="Removal"
              />
              <FormControlLabel value="NOTE" control={<Radio />} label="Note" />
              <FormControlLabel
                value="PROMPT"
                control={<Radio />}
                label="Prompt"
              />
            </RadioGroup>
          </FormControl>
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
        {actions_html}
      </Grid>
    </div>
  );
};

export default ModifierTypeComponent;
