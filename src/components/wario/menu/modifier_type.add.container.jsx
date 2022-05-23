import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ModifierTypeComponent from "./modifier_type.component";

const ModifierTypeAddContainer = ({ ENDPOINT, onCloseCallback }) => {
  const [ordinal, setOrdinal] = useState(0);
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [minSelected, setMinSelected] = useState(0);
  const [maxSelected, setMaxSelected] = useState("");
  const [revelID, setRevelID] = useState("");
  const [squareID, setSquareID] = useState("");
  const [omitOptionIfNotAvailable, setOmitOptionIfNotAvailable] = useState(false);
  const [omitSectionIfNoAvailableOptions, setOmitSectionIfNoAvailableOptions] = useState(true);
  const [useToggleIfOnlyTwoOptions, setUseToggleIfOnlyTwoOptions] = useState(false);
  const [isHiddenDuringCustomization, setIsHiddenDuringCustomization] = useState(false);
  const [emptyDisplayAs, setEmptyDisplayAs] = useState("OMIT");
  const [modifierClass, setModifierClass] = useState("ADD");
  const [templateString, setTemplateString] = useState("");
  const [multipleItemSeparator, setMultipleItemSeparator] = useState(" + ");
  const [nonEmptyGroupPrefix, setNonEmptyGroupPrefix] = useState("");
  const [nonEmptyGroupSuffix, setNonEmptyGroupSuffix] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addModifierType = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${ENDPOINT}/api/v1/menu/option/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            display_name: displayName,
            ordinal,
            min_selected: minSelected,
            max_selected: maxSelected || null,
            revelID,
            squareID,
            display_flags: {
              omit_options_if_not_available: omitOptionIfNotAvailable,
              omit_section_if_no_available_options: omitSectionIfNoAvailableOptions,
              use_toggle_if_only_two_options: (useToggleIfOnlyTwoOptions && minSelected === 1 && maxSelected === 1),
              hidden: isHiddenDuringCustomization,
              empty_display_as: emptyDisplayAs,
              modifier_class: modifierClass,
              template_string: templateString || "",
              multiple_item_separator: multipleItemSeparator || "",
              non_empty_group_prefix: nonEmptyGroupPrefix || "",
              non_empty_group_suffix: nonEmptyGroupSuffix || ""
            }
          }),
        });
        if (response.status === 201) {
          setOrdinal(0);
          setName("");
          setDisplayName("");
          setMinSelected(0);
          setMaxSelected("");
          setRevelID("");
          setSquareID("");
          setOmitOptionIfNotAvailable(false);
          setOmitSectionIfNoAvailableOptions(false);
          setUseToggleIfOnlyTwoOptions(false);
          setIsHiddenDuringCustomization(false);
          setEmptyDisplayAs("OMIT");
          setModifierClass("ADD");
          setTemplateString("");
          setMultipleItemSeparator(" + ");
          setNonEmptyGroupPrefix("");
          setNonEmptyGroupSuffix("");
          onCloseCallback();
        }
        setIsProcessing(false);
          
      } catch (error) {
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <ModifierTypeComponent 
      confirmText="Add"
      onCloseCallback={onCloseCallback}
      onConfirmClick={addModifierType}
      isProcessing={isProcessing}
      ordinal={ordinal}
      setOrdinal={setOrdinal}
      name={name}
      setName={setName}
      displayName={displayName}
      setDisplayName={setDisplayName}
      minSelected={minSelected} 
      setMinSelected={setMinSelected}
      maxSelected={maxSelected} 
      setMaxSelected={setMaxSelected}
      templateString={templateString}
      setTemplateString={setTemplateString}
      multipleItemSeparator={multipleItemSeparator}
      setMultipleItemSeparator={setMultipleItemSeparator}
      nonEmptyGroupPrefix={nonEmptyGroupPrefix}
      setNonEmptyGroupPrefix={setNonEmptyGroupPrefix}
      nonEmptyGroupSuffix={nonEmptyGroupSuffix}
      setNonEmptyGroupSuffix={setNonEmptyGroupSuffix}
      revelID={revelID}
      setRevelID={setRevelID}
      squareID={squareID} 
      setSquareID={setSquareID}
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
    />
  );
};

export default ModifierTypeAddContainer;
