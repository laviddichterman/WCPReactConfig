import { useCallback, useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { Accordion, AccordionSummary, AccordionDetails, Grid, Typography, Switch, FormControlLabel } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { ModifierTypeComponent } from "./modifier_type.component";
import { ModifierOptionContainer } from "../modifier_option/modifier_option.component";
import { HOST_API } from "../../../../config";
import { useAppSelector } from "../../../../hooks/useRedux";
import { DISPLAY_AS, IOption, IOptionType, MODIFIER_CLASS } from "@wcp/wcpshared";
import { getModifierTypeEntryById } from "@wcp/wario-ux-shared";
// import { ProductAddRequestType } from "./modifier_type.add.container";
import { useSnackbar } from "notistack";
import { useIndexedState } from "../../../../utils/common";

export interface ModifierTypeCopyContainerProps {
  modifierType: IOptionType;
  onCloseCallback: VoidFunction;
};
const ModifierTypeCopyContainer = ({ modifierType, onCloseCallback }: ModifierTypeCopyContainerProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const modifierTypeEntry = useAppSelector(s=>getModifierTypeEntryById(s.ws.modifierEntries, modifierType.id)!);
  const allOptions = useAppSelector(s=>s.ws.catalog!.options);

  const [ordinal, setOrdinal] = useState(modifierType.ordinal);
  const [name, setName] = useState(modifierType.name);
  const [displayName, setDisplayName] = useState(modifierType.displayName ?? "");
  const [externalIds, setExternalIds] = useState(modifierType.externalIDs);
  const [minSelected, setMinSelected] = useState(modifierType.min_selected || 0);
  const [maxSelected, setMaxSelected] = useState(modifierType.max_selected || null);
  const [omitOptionIfNotAvailable, setOmitOptionIfNotAvailable] = useState(modifierType.displayFlags.omit_options_if_not_available ?? false);
  const [omitSectionIfNoAvailableOptions, setOmitSectionIfNoAvailableOptions] = useState(modifierType.displayFlags.omit_section_if_no_available_options ?? false);
  const [useToggleIfOnlyTwoOptions, setUseToggleIfOnlyTwoOptions] = useState(modifierType.displayFlags.use_toggle_if_only_two_options ?? false);
  const [isHiddenDuringCustomization, setIsHiddenDuringCustomization] = useState(modifierType.displayFlags.hidden ?? false);
  const [modifierClass, setModifierClass] = useState(modifierType.displayFlags.modifier_class ?? MODIFIER_CLASS.ADD);
  const [emptyDisplayAs, setEmptyDisplayAs] = useState(modifierType.displayFlags.empty_display_as ?? DISPLAY_AS.OMIT);
  const [templateString, setTemplateString] = useState(modifierType.displayFlags.template_string ?? "");
  const [multipleItemSeparator, setMultipleItemSeparator] = useState(modifierType.displayFlags.multiple_item_separator ?? "");
  const [nonEmptyGroupPrefix, setNonEmptyGroupPrefix] = useState(modifierType.displayFlags.non_empty_group_prefix ?? "");
  const [nonEmptyGroupSuffix, setNonEmptyGroupSuffix] = useState(modifierType.displayFlags.non_empty_group_suffix ?? "");
  const [is3p, setIs3p] = useState(modifierType.displayFlags.is3p);

  // product instance indexed state
  const [expandedPanels, setExpandedPanel] = useIndexedState(useState(Array(modifierTypeEntry.options.length).fill(false)));
  const [copyOpFlags, setCopyOpFlag] = useIndexedState(useState(Array(modifierTypeEntry.options.length).fill(true)));

  const [opDisplayName, setOpDisplayName] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].displayName)));
  const [opDescription, setOpDescription] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].description)));
  const [opShortcode, setOpShortcode] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].shortcode)));
  const [opOrdinal, setOpOrdinal] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].ordinal)));
  const [opPrice, setOpPrice] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].price)));
  const [opExternalIds, setOpExternalIds] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].externalIDs)));
  const [opEnableFunction, setOpEnableFunction] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].enable ?? null)));
  const [opFlavorFactor, setOpFlavorFactor] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].metadata.flavor_factor)));
  const [opBakeFactor, setOpBakeFactor] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].metadata.bake_factor)));
  const [opCanSplit, setOpCanSplit] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].metadata.can_split)));
  const [opAllowHeavy, setOpAllowHeavy] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].metadata.allowHeavy)));
  const [opAllowLite, setOpAllowLite] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].metadata.allowLite)));
  const [opAllowOTS, setOpAllowOTS] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].metadata.allowOTS)));
  const [opOmitFromShortname, setOpOmitFromShortname] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].displayFlags.omit_from_shortname ?? false)));
  const [opOmitFromName, setOpOmitFromName] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].displayFlags.omit_from_name ?? false)));
  const [opDisabled, setOpDisabled] = useIndexedState(useState(modifierTypeEntry.options.map(oId => allOptions[oId].disabled ?? null)));

  // API state
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const getModifierOptionEditor = useCallback((i: number) => (
    <Accordion sx={{ p: 2 }} key={i} expanded={expandedPanels[i] && copyOpFlags[i]} onChange={(e, ex) => setExpandedPanel(i)(ex)}  >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Grid container>
          <Grid item xs>
            <Typography sx={{ ml: 4 }}>{opDisplayName[i]}</Typography>
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel sx={{ float: "right" }} control={
              <Switch
                checked={copyOpFlags[i]}
                onChange={(e) => setCopyOpFlag(i)(e.target.checked)}
                name="Copy"
              />
            }
              label="Copy"
            />
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3} justifyContent="center">
          <ModifierOptionContainer
            isProcessing={isProcessing}
            modifierType={{
              displayName,
              min_selected: minSelected,
              max_selected: maxSelected,
              name,
              displayFlags: {
                omit_options_if_not_available: omitOptionIfNotAvailable,
                omit_section_if_no_available_options: omitSectionIfNoAvailableOptions,
                empty_display_as: emptyDisplayAs,
                hidden: isHiddenDuringCustomization,
                is3p,
                modifier_class: modifierClass,
                multiple_item_separator: multipleItemSeparator,
                non_empty_group_prefix: nonEmptyGroupPrefix,
                non_empty_group_suffix: nonEmptyGroupSuffix,
                template_string: templateString,
                use_toggle_if_only_two_options: useToggleIfOnlyTwoOptions
              },
              externalIDs: externalIds,
              ordinal
            }}
            displayName={opDisplayName[i]}
            setDisplayName={setOpDisplayName(i)}
            description={opDescription[i]}
            setDescription={setOpDescription(i)}
            shortcode={opShortcode[i]}
            setShortcode={setOpShortcode(i)}
            ordinal={opOrdinal[i]}
            setOrdinal={setOpOrdinal(i)}
            price={opPrice[i]}
            setPrice={setOpPrice(i)}
            externalIds={opExternalIds[i]}
            setExternalIds={setOpExternalIds(i)}
            enableFunction={opEnableFunction[i]}
            setEnableFunction={setOpEnableFunction(i)}
            flavorFactor={opFlavorFactor[i]}
            setFlavorFactor={setOpFlavorFactor(i)}
            bakeFactor={opBakeFactor[i]}
            setBakeFactor={setOpBakeFactor(i)}
            canSplit={opCanSplit[i]}
            setCanSplit={setOpCanSplit(i)}
            allowHeavy={opAllowHeavy[i]}
            setAllowHeavy={setOpAllowHeavy(i)}
            allowLite={opAllowLite[i]}
            setAllowLite={setOpAllowLite(i)}
            allowOTS={opAllowOTS[i]}
            setAllowOTS={setOpAllowOTS(i)}
            omitFromShortname={opOmitFromShortname[i]}
            setOmitFromShortname={setOpOmitFromShortname(i)}
            omitFromName={opOmitFromName[i]}
            setOmitFromName={setOpOmitFromName(i)}
            disabled={opDisabled[i]}
            setDisabled={setOpDisabled(i)}
          />
        </Grid>
      </AccordionDetails>
    </Accordion>), [isProcessing, expandedPanels, copyOpFlags, displayName, emptyDisplayAs, externalIds, is3p, isHiddenDuringCustomization, maxSelected, minSelected, modifierClass, multipleItemSeparator, name, nonEmptyGroupPrefix, nonEmptyGroupSuffix, omitOptionIfNotAvailable, omitSectionIfNoAvailableOptions, opAllowHeavy, opAllowLite, opAllowOTS, opBakeFactor, opCanSplit, opDescription, opDisabled, opDisplayName, opEnableFunction, opExternalIds, opFlavorFactor, opOmitFromName, opOmitFromShortname, opOrdinal, opPrice, opShortcode, ordinal, setCopyOpFlag, setExpandedPanel, setOpAllowHeavy, setOpAllowLite, setOpAllowOTS, setOpBakeFactor, setOpCanSplit, setOpDescription, setOpDisabled, setOpDisplayName, setOpEnableFunction, setOpExternalIds, setOpFlavorFactor, setOpOmitFromName, setOpOmitFromShortname, setOpOrdinal, setOpPrice, setOpShortcode, templateString, useToggleIfOnlyTwoOptions])

  const copyModifierTypeAndOptions = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body: Omit<IOptionType, "id"> = {
          name,
          displayName,
          ordinal,
          min_selected: minSelected,
          max_selected: maxSelected || null,
          externalIDs: externalIds,
          displayFlags: {
            omit_options_if_not_available: omitOptionIfNotAvailable,
            omit_section_if_no_available_options: omitSectionIfNoAvailableOptions,
            use_toggle_if_only_two_options: (useToggleIfOnlyTwoOptions && minSelected === 1 && maxSelected === 1),
            hidden: isHiddenDuringCustomization,
            empty_display_as: emptyDisplayAs,
            modifier_class: modifierClass,
            template_string: templateString || "",
            multiple_item_separator: multipleItemSeparator || "",
            non_empty_group_prefix: nonEmptyGroupPrefix || "",
            non_empty_group_suffix: nonEmptyGroupSuffix || "",
            is3p
          }
        };
        const response = await fetch(`${HOST_API}/api/v1/menu/option/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.status === 201) {
          enqueueSnackbar(`Added new modifier type: ${name}.`);
          const json_response = await response.json();
          const copiedModifierTypeId = json_response.id as string;
          for (let i = 0; i < modifierTypeEntry.options.length; ++i) {
            if (copyOpFlags[i]) {
              try {
                await new Promise((res) => setTimeout(res, 200));
                const addOptionBody: Omit<IOption, "id" | 'modifierTypeId'> = {
                  displayName: opDisplayName[i],
                  description: opDescription[i],
                  shortcode: opShortcode[i],
                  disabled: opDisabled[i],
                  price: opPrice[i],
                  ordinal: opOrdinal[i],
                  enable: opEnableFunction[i],
                  externalIDs: opExternalIds[i],
                  metadata: {
                    flavor_factor: opFlavorFactor[i],
                    bake_factor: opBakeFactor[i],
                    can_split: opCanSplit[i],
                    allowHeavy: opAllowHeavy[i],
                    allowLite: opAllowLite[i],
                    allowOTS: opAllowOTS[i]
                  },
                  displayFlags: {
                    omit_from_shortname: opOmitFromShortname[i],
                    omit_from_name: opOmitFromName[i]
                  }
                };
                const response = await fetch(`${HOST_API}/api/v1/menu/option/${copiedModifierTypeId}/`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(addOptionBody),
                });
                if (response.status === 201) {
                  enqueueSnackbar(`Added modifier option: ${displayName}.`);
                }
              } catch (error) {
                enqueueSnackbar(`Unable to add modifier option: ${displayName}. Got error ${JSON.stringify(error, )}`, { variant: 'error' });
                console.error(error);
                throw error;
              }
            }
          }
          onCloseCallback();
        }
      } catch (error) {
        enqueueSnackbar(`Unable to add modifier type: ${name}. Got error ${JSON.stringify(error)}`, { variant: 'error' });
        console.error(error);
      }
      setIsProcessing(false);
    }
  };

  return (
    <ModifierTypeComponent
      confirmText="Save"
      onCloseCallback={onCloseCallback}
      onConfirmClick={copyModifierTypeAndOptions}
      isProcessing={isProcessing}
      disableConfirm={false}
      ordinal={ordinal}
      setOrdinal={setOrdinal}
      name={name}
      setName={setName}
      displayName={displayName}
      setDisplayName={setDisplayName}
      externalIds={externalIds}
      setExternalIds={setExternalIds}
      minSelected={minSelected}
      setMinSelected={setMinSelected}
      maxSelected={maxSelected}
      setMaxSelected={setMaxSelected}
      omitOptionIfNotAvailable={omitOptionIfNotAvailable}
      setOmitOptionIfNotAvailable={setOmitOptionIfNotAvailable}
      omitSectionIfNoAvailableOptions={omitSectionIfNoAvailableOptions}
      setOmitSectionIfNoAvailableOptions={setOmitSectionIfNoAvailableOptions}
      useToggleIfOnlyTwoOptions={useToggleIfOnlyTwoOptions}
      setUseToggleIfOnlyTwoOptions={setUseToggleIfOnlyTwoOptions}
      isHiddenDuringCustomization={isHiddenDuringCustomization}
      setIsHiddenDuringCustomization={setIsHiddenDuringCustomization}
      emptyDisplayAs={emptyDisplayAs}
      setEmptyDisplayAs={setEmptyDisplayAs}
      modifierClass={modifierClass}
      setModifierClass={setModifierClass}
      templateString={templateString}
      setTemplateString={setTemplateString}
      multipleItemSeparator={multipleItemSeparator}
      setMultipleItemSeparator={setMultipleItemSeparator}
      nonEmptyGroupPrefix={nonEmptyGroupPrefix}
      setNonEmptyGroupPrefix={setNonEmptyGroupPrefix}
      nonEmptyGroupSuffix={nonEmptyGroupSuffix}
      setNonEmptyGroupSuffix={setNonEmptyGroupSuffix}
      is3p={is3p}
      setIs3p={setIs3p}
      children={modifierTypeEntry.options.map((_, i) => getModifierOptionEditor(i)
      )}
    />
  );
};

export default ModifierTypeCopyContainer;