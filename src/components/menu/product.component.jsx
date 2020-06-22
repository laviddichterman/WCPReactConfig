import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Switch from "@material-ui/core/Switch";
import Autocomplete from "@material-ui/lab/Autocomplete";

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

const ProductComponent = ({
  actions,
  progress,
  modifier_types,
  categories,
  displayName, setDisplayName,
  description, setDescription,
  shortcode, setShortcode,
  price, setPrice,
  enabled, setEnabled,
  revelID, setRevelID,
  squareID, setSquareID,
  parentCategories, setParentCategories, 
  modifiers, setModifiers
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
        <Grid item xs={12}>
          <Autocomplete
            multiple
            filterSelectedOptions
            options={categories}
            value={parentCategories}
            onChange={(e, v) => setParentCategories(v)}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField {...params} label="Categories" />
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
        <Grid item xs={4}>
          <TextField
            label="Short Code"
            type="text"
            inputProps={{ size: 40 }}
            value={shortcode}
            size="small"
            onChange={(e) => setShortcode(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
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
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Switch checked={enabled} onChange={e => setEnabled(e.target.checked)} name="Enabled" />
            }
            label="Enabled"
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
        <Grid item xs={12}>
          <Autocomplete
            multiple
            filterSelectedOptions
            options={modifier_types}
            value={modifiers}
            onChange={(e, v) => setModifiers(v.sort((a, b)=> a.ordinal - b.ordinal))}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField {...params} label="Modifiers" />
            )}
          />
        </Grid>
        {actions_html}
        {progress}
      </Grid>
    </div>
  );
};

export default ProductComponent;
