import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
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

const CategoryComponent = ({ 
  categories, 
  actions, 
  description, setDescription, 
  ordinal, setOrdinal,
  subheading, setSubheading, 
  footnotes, setFootnotes,
  name, setName,
  callLineName, setCallLineName,
  callLineDisplay, setCallLineDisplay, 
  parent, setParent }) => {
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
        <Grid item xs={6}>
          <TextField
            label="Category Name"
            type="text"
            inputProps={{ size: 30 }}
            value={name}
            size="small"
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            options={categories}
            value={parent}
            onChange={(e, v) => setParent(v)}
            getOptionLabel={(option) => option.category.name}
            getOptionSelected={(option, value) => option.category._id === value.category._id}
            renderInput={(params) => (
              <TextField {...params} label="Parent Category (Optional)" />
            )}
          />
        </Grid>
        <Grid item xs={9}>
          <TextField
            multiline
            fullWidth
            label="Category Description (Optional, HTML allowed)"
            type="text"
            inputProps={{ size: 100 }}
            value={description}
            size="small"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <CheckedInputComponent
            label="Ordinal"
            type="number"
            fullWidth
            value={ordinal}
            inputProps={{ min: 0 }}
            onFinishChanging={(e) => setOrdinal(e)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            fullWidth
            label="Subheading (Optional, HTML allowed)"
            type="text"
            inputProps={{ size: 100 }}
            value={subheading}
            size="small"
            onChange={(e) => setSubheading(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            fullWidth
            label="Footnotes (Optional, HTML allowed)"
            type="text"
            inputProps={{ size: 100 }}
            value={footnotes}
            size="small"
            onChange={(e) => setFootnotes(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Call Line Name"
            type="text"
            inputProps={{ size: 40 }}
            value={callLineName}
            size="small"
            onChange={(e) => setCallLineName(e.target.value)}
          />
        </Grid>
        <Grid container item xs={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Call Line Display</FormLabel>
            <RadioGroup
              defaultValue="SHORTNAME"
              aria-label="call-line-display"
              name="call-line-display"
              row
              value={callLineDisplay}
              onChange={(e) => setCallLineDisplay(e.target.value)}
            >
              <FormControlLabel
                value="SHORTNAME"
                control={<Radio />}
                label="Shortname"
              />
              <FormControlLabel
                value="SHORTCODE"
                control={<Radio />}
                label="Shortcode"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        {actions_html}
      </Grid>
    </div>
  );
};

export default CategoryComponent;
