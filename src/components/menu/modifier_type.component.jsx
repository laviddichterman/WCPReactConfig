import React from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Switch from "@mui/material/Switch";
import CheckedInputComponent from "../checked_input.component";

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
  templateString,
  setTemplateString,
  multipleItemSeparator,
  setMultipleItemSeparator,
  nonEmptyGroupPrefix,
  setNonEmptyGroupPrefix,
  nonEmptyGroupSuffix,
  setNonEmptyGroupSuffix,
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
  emptyDisplayAs,
  setEmptyDisplayAs,
  modifierClass,
  setModifierClass,
}) => {
  const handleSetMaxSelected = (val) => {
    if (val !== 1) {
      if (emptyDisplayAs === "LIST_CHOICES") {
        setEmptyDisplayAs("YOUR_CHOICE_OF");
      }
      setUseToggleIfOnlyTwoOptions(false);
    }
    setMaxSelected(val);
  }

  const handleSetMinSelected = (val) => {
    if (val !== 1) {
      setUseToggleIfOnlyTwoOptions(false);
    }
    if (maxSelected < val) {
      setMaxSelected(val);
    }
    setMinSelected(val);
  }

  const actions_html =
    actions.length === 0 ? (
      ""
    ) : (
      <Grid container justifyContent="flex-end" item xs={12}>
        {actions.map((action, idx) => (
          <Grid item key={idx}>
            {action}
          </Grid>
        ))}
      </Grid>
    );

  return (
    <div>
      <Grid container spacing={3} justifyContent="center">
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
            onFinishChanging={(e) => handleSetMinSelected(e)}
          />
        </Grid>
        <Grid item xs={4}>
          <CheckedInputComponent
            label="Max Selected"
            type="number"
            value={maxSelected}
            allowEmpty
            inputProps={{ size: 10, min: minSelected }}
            onFinishChanging={(e) => handleSetMaxSelected(e)}
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
        <Grid container item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Empty modifier display in product name as...</FormLabel>
            <RadioGroup
              defaultValue="OMIT"
              aria-label="empty-display-as"
              name="empty-display-as"
              row
              value={emptyDisplayAs}
              onChange={(e) => setEmptyDisplayAs(e.target.value)}
            >
              <FormControlLabel
                value="OMIT"
                control={<Radio />}
                label="Omit"
              />
              <FormControlLabel
                value="YOUR_CHOICE_OF"
                control={<Radio />}
                label="Your Choice Of..."
              />
              <FormControlLabel
                value="LIST_CHOICES"
                control={<Radio />}
                label="List Choices"
                disabled={maxSelected !== 1}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Template String"
            type="text"
            fullWidth
            inputProps={{ size: 40 }}
            value={templateString}
            size="small"
            onChange={(e) => setTemplateString(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Multiple Item Separator"
            type="text"
            fullWidth
            inputProps={{ size: 40 }}
            value={multipleItemSeparator}
            size="small"
            onChange={(e) => setMultipleItemSeparator(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Non-Empty Group Prefix"
            type="text"
            fullWidth
            inputProps={{ size: 40 }}
            value={nonEmptyGroupPrefix}
            size="small"
            onChange={(e) => setNonEmptyGroupPrefix(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Non-Empty Group Suffix"
            type="text"
            fullWidth
            inputProps={{ size: 40 }}
            value={nonEmptyGroupSuffix}
            size="small"
            onChange={(e) => setNonEmptyGroupSuffix(e.target.value)}
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
        {actions_html}
      </Grid>
    </div>
  );
};

export default ModifierTypeComponent;
