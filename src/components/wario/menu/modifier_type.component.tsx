import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { ElementActionComponent } from "./element.action.component";
import { CheckedNumericInput } from "../CheckedNumericTextInput";
import { DISPLAY_AS, IOptionType, MODIFIER_CLASS } from "@wcp/wcpshared";
import { startCase, snakeCase } from 'lodash';
import { ValSetValNamed } from "../../../utils/common";
import { StringPropertyComponent } from "../property-components/StringPropertyComponent";
import { StringEnumPropertyComponent } from "../property-components/StringEnumPropertyComponent";
import { ToggleBooleanPropertyComponent } from "../property-components/ToggleBooleanPropertyComponent";
import { IntNumericPropertyComponent } from "../property-components/IntNumericPropertyComponent";

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
            <StringPropertyComponent
              disabled={isProcessing}
              label="Modifier Type Name"
              setValue={setName}
              value={name}
            />
          </Grid>
          <Grid item xs={12}>
            <StringPropertyComponent
              disabled={isProcessing}
              label="Display Name (Optional)"
              setValue={setDisplayName}
              value={displayName}
            />
          </Grid>
          <Grid item xs={4}>
          <IntNumericPropertyComponent
              disabled={isProcessing}
              label="Ordinal"
              value={ordinal}
              setValue={setOrdinal}
            />
          </Grid>
          <Grid item xs={4}>
          <IntNumericPropertyComponent
              disabled={isProcessing}
              label="Min Selected"
              value={minSelected}
              setValue={handleSetMinSelected}
            />
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
            <ToggleBooleanPropertyComponent
              disabled={isProcessing}
              label="Omit Section If No Available Options"
              value={omitSectionIfNoAvailableOptions}
              setValue={setOmitSectionIfNoAvailableOptions}
            />
          </Grid>
          <Grid item xs={6}>
            <ToggleBooleanPropertyComponent
              disabled={isProcessing}
              label="Omit Option If Not Available"
              value={omitOptionIfNotAvailable}
              setValue={setOmitOptionIfNotAvailable}
            />
          </Grid>
          <Grid item xs={6}>
            <ToggleBooleanPropertyComponent
              disabled={isProcessing || maxSelected !== 1 || minSelected !== 1}
              label="Use Toggle If Only Two Options"
              value={useToggleIfOnlyTwoOptions}
              setValue={setUseToggleIfOnlyTwoOptions}
            />
          </Grid>
          <Grid item xs={6}>
            <ToggleBooleanPropertyComponent disabled={isProcessing} label="Hide from user customization" setValue={setIsHiddenDuringCustomization} value={isHiddenDuringCustomization} />
          </Grid>
          <Grid container item xs={12}>
            <StringEnumPropertyComponent
              disabled={isProcessing}
              label="Modifier Class"
              value={modifierClass}
              setValue={setModifierClass}
              options={Object.keys(MODIFIER_CLASS)}
            />
          </Grid>
          <Grid container item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Empty modifier display in product name as...</FormLabel>
              <RadioGroup
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
                    disabled={opt === DISPLAY_AS.LIST_CHOICES && maxSelected !== 1}
                    control={<Radio />}
                    label={startCase(snakeCase(opt))}
                  />
                )}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <StringPropertyComponent
              disabled={isProcessing}
              label="Template String"
              setValue={setTemplateString}
              value={templateString}
            />
          </Grid>
          <Grid item xs={6}>
            <StringPropertyComponent
              disabled={isProcessing}
              label="Multiple Item Separator"
              setValue={setMultipleItemSeparator}
              value={multipleItemSeparator}
            />
          </Grid>
          <Grid item xs={6}>
            <StringPropertyComponent
              disabled={isProcessing}
              label="Non-Empty Group Prefix"
              setValue={setNonEmptyGroupPrefix}
              value={nonEmptyGroupPrefix}
            />
          </Grid>
          <Grid item xs={6}>
            <StringPropertyComponent
              disabled={isProcessing}
              label="Non-Empty Group Suffix"
              setValue={setNonEmptyGroupSuffix}
              value={nonEmptyGroupSuffix}
            />
          </Grid>
        </>}
    />
  );
};

export default ModifierTypeComponent;
