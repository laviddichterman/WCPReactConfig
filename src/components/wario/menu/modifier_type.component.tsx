import React, { Dispatch, SetStateAction } from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Switch from "@mui/material/Switch";
import { ElementActionComponent } from "./element.action.component";
import { CheckedNumericInput } from "../CheckedNumericTextInput";
import { DISPLAY_AS, IOptionType, MODIFIER_CLASS } from "@wcp/wcpshared";
import { startCase, snakeCase } from 'lodash';
import { ValSetValNamed } from "src/utils/common";

export interface ModifierTypeUiProps {
  onCloseCallback: VoidFunction;
}

export type ModifierTypeModifyUiProps = {
  modifier_type: IOptionType;
} & ModifierTypeUiProps;

export type ModifierTypeComponentProps = 
ValSetValNamed<number, 'ordinal'> & 
ValSetValNamed<number, 'minSelected'> & 
ValSetValNamed<number | null, 'maxSelected'> & 
ValSetValNamed<string, 'name'> & 
ValSetValNamed<string, 'displayName'> & 
ValSetValNamed<string, 'templateString'> & 
ValSetValNamed<string, 'multipleItemSeparator'> & 
ValSetValNamed<string, 'nonEmptyGroupPrefix'> & 
ValSetValNamed<string, 'nonEmptyGroupSuffix'> & 
ValSetValNamed<boolean, 'omitOptionIfNotAvailable'> & 
ValSetValNamed<boolean, 'omitSectionIfNoAvailableOptions'> & 
ValSetValNamed<boolean, 'useToggleIfOnlyTwoOptions'> & 
ValSetValNamed<boolean, 'isHiddenDuringCustomization'> & 
ValSetValNamed<keyof typeof DISPLAY_AS, 'emptyDisplayAs'> & 
ValSetValNamed<keyof typeof MODIFIER_CLASS, 'modifierClass'> & {
  confirmText: string;
  onConfirmClick: VoidFunction;
  isProcessing: boolean;
};

const ModifierTypeComponent = ({
  confirmText,
  onCloseCallback,
  onConfirmClick,
  isProcessing,
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
}: ModifierTypeComponentProps & ModifierTypeUiProps) => {
  const handleSetMaxSelected = (val: number | null) => {
    if (val !== 1) {
      if (emptyDisplayAs === DISPLAY_AS.LIST_CHOICES) {
        setEmptyDisplayAs(DISPLAY_AS.YOUR_CHOICE_OF);
      }
      setUseToggleIfOnlyTwoOptions(false);
    }
    setMaxSelected(val);
  }

  const handleSetMinSelected = (val: number) => {
    if (val !== 1) {
      setUseToggleIfOnlyTwoOptions(false);
    }
    if (maxSelected !== null && maxSelected < val) {
      setMaxSelected(val);
    }
    setMinSelected(val);
  }

  return (
    <ElementActionComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={onConfirmClick}
      isProcessing={isProcessing}
      disableConfirmOn={name.length === 0 ||
        (Number.isFinite(maxSelected) && (maxSelected as number) < minSelected) ||
        (useToggleIfOnlyTwoOptions && ((maxSelected as number) !== 1 && minSelected !== 1)) ||
        isProcessing}
      confirmText={confirmText}
      body={
        <>
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
            <CheckedNumericInput
              label="Ordinal"
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0, max: 43200, pattern: '[0-9]*', step: 1 }}
              value={ordinal}
              disabled={isProcessing}
              onChange={(e) => setOrdinal(e)}
              parseFunction={parseInt}
              allowEmpty={false} />
          </Grid>
          <Grid item xs={4}>
            <CheckedNumericInput
              label="Min Selected"
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0, max: 43200, pattern: '[0-9]*', step: 1 }}
              value={minSelected}
              disabled={isProcessing}
              onChange={(e) => handleSetMinSelected(e)}
              parseFunction={parseInt}
              allowEmpty={false} />

          </Grid>
          <Grid item xs={4}>
            <CheckedNumericInput
              label="Max Selected"
              type="number"
              inputProps={{ inputMode: 'numeric', min: minSelected, pattern: '[0-9]*', step: 1 }}
              value={maxSelected}
              disabled={isProcessing}
              onChange={(e) => handleSetMaxSelected(e)}
              parseFunction={(v) => v !== null && v ? parseInt(v) : null}
              allowEmpty={true} />
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
                onChange={(e) => setModifierClass(e.target.value as keyof typeof MODIFIER_CLASS)}
              >
                {Object.keys(MODIFIER_CLASS).map((opt, i) =>
                  <FormControlLabel
                    key={i}
                    value={opt}
                    control={<Radio />}
                    label={startCase(snakeCase(opt))}
                  />
                )}
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
                onChange={(e) => setEmptyDisplayAs(e.target.value as keyof typeof DISPLAY_AS)}
              >
                {Object.keys(DISPLAY_AS).map((opt, i) =>
                  <FormControlLabel
                    key={i}
                    value={opt}
                    disabled={opt === "LIST_CHOICES" && maxSelected !== 1}
                    control={<Radio />}
                    label={startCase(snakeCase(opt))}
                  />
                )}
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
        </>}
    />
  );
};

export default ModifierTypeComponent;
