import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
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

const ProductComponent = ({
  actions,
  progress,
  modifier_types,
  categories,
  suppressNonProductInstanceFields,
  displayName,
  setDisplayName,
  description,
  setDescription,
  shortcode,
  setShortcode,
  price,
  setPrice,
  disabled,
  setDisabled,
  ordinal,
  setOrdinal,
  revelID,
  setRevelID,
  squareID,
  setSquareID,
  parentCategories,
  setParentCategories,
  modifiers,
  setModifiers,
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
          <Autocomplete
            multiple
            filterSelectedOptions
            options={Object.values(categories)}
            value={parentCategories.filter((x) => x)}
            onChange={(e, v) => setParentCategories(v)}
            getOptionLabel={(option) => option.category.name}
            getOptionSelected={(option, value) =>
              option.category._id === value.category._id
            }
            renderInput={(params) => (
              <TextField {...params} label="Categories" />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Display Name"
            type="text"
            inputProps={{ size: 60 }}
            value={displayName}
            size="small"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
        {suppressNonProductInstanceFields ? "" :
          <TextField
            label="Description"
            type="text"
            inputProps={{ size: 60 }}
            value={description}
            size="small"
            onChange={(e) => setDescription(e.target.value)}
          />}
        </Grid>
        <Grid container item xs={7}>
        <Grid item xs={4}>
          <CheckedInputComponent
            label="Ordinal"
            type="number"
            value={ordinal}
            inputProps={{ min: 0 }}
            onFinishChanging={(e) => setOrdinal(e)}
          />
        </Grid>
        {suppressNonProductInstanceFields ? "" :
        (<><Grid item xs={4}>
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
        <Grid item xs={4}>
          <TextField
            label="Revel ID"
            type="text"
            inputProps={{ size: 20 }}
            value={revelID}
            size="small"
            onChange={(e) => setRevelID(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Square ID"
            type="text"
            inputProps={{ size: 20 }}
            value={squareID}
            size="small"
            onChange={(e) => setSquareID(e.target.value)}
          />
        </Grid></>) }
        </Grid>
        {suppressNonProductInstanceFields ? "" :
        <Grid item xs={5}>
          <DatetimeBasedDisableComponent
            disabled={disabled}
            setDisabled={setDisabled}
          />
        </Grid> }
        <Grid item xs={12}>
          <Autocomplete
            multiple
            filterSelectedOptions
            options={Object.values(modifier_types)}
            value={modifiers}
            onChange={(e, v) =>
              setModifiers(
                v.sort(
                  (a, b) => a.modifier_type.ordinal - b.modifier_type.ordinal
                )
              )
            }
            getOptionLabel={(option) => option ? option.modifier_type.name : "CORRUPT DATA"}
            getOptionSelected={(option, value) =>
              option && value && option.modifier_type._id === value.modifier_type._id
            }
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
