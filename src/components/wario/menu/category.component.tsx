import React from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { ElementActionComponent } from "./element.action.component";
import CheckedInputComponent from "../checked_input.component";

const CategoryComponent = ({ 
  onCloseCallback,
  onConfirmClick,
  isProcessing,
  confirmText,
  categories, 
  description, setDescription, 
  ordinal, setOrdinal,
  subheading, setSubheading, 
  footnotes, setFootnotes,
  name, setName,
  callLineName, setCallLineName,
  callLineDisplay, setCallLineDisplay, 
  parent, setParent }) => (
  <ElementActionComponent 
    onCloseCallback={onCloseCallback}
    onConfirmClick={onConfirmClick}
    isProcessing={isProcessing}
    disableConfirmOn={name.length === 0 || ordinal < 0 || isProcessing}
    confirmText={confirmText}
    body={
      <>
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
            isOptionEqualToValue={(option, value) => option.category._id === value.category._id}
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
      </>
      }
    />
  );


export default CategoryComponent;