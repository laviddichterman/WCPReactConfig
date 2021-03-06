import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ModifierTypeComponent from "./modifier_type.component";
import { useAuth0 } from '@auth0/auth0-react';

const ModifierTypeEditContainer = ({ ENDPOINT, modifier_type, onCloseCallback }) => {
  const [ordinal, setOrdinal] = useState(modifier_type.ordinal);
  const [name, setName] = useState(modifier_type.name);
  const [displayName, setDisplayName] = useState(modifier_type.display_name ?? "");
  const [minSelected, setMinSelected] = useState(modifier_type.min_selected || 0);
  const [maxSelected, setMaxSelected] = useState(modifier_type.max_selected || "");
  const [revelID, setRevelID] = useState(modifier_type.externalIDs?.revelID ?? "");
  const [squareID, setSquareID] = useState(modifier_type.externalIDs?.squareID ?? "");
  const [omitOptionIfNotAvailable, setOmitOptionIfNotAvailable] = useState(modifier_type.display_flags?.omit_options_if_not_available ?? false);
  const [omitSectionIfNoAvailableOptions, setOmitSectionIfNoAvailableOptions] = useState(modifier_type.display_flags?.omit_section_if_no_available_options ?? false);
  const [useToggleIfOnlyTwoOptions, setUseToggleIfOnlyTwoOptions] = useState(modifier_type.display_flags?.use_toggle_if_only_two_options ?? false);
  const [isHiddenDuringCustomization, setIsHiddenDuringCustomization] = useState(modifier_type.display_flags?.hidden ?? false);
  const [modifierClass, setModifierClass] = useState(modifier_type.display_flags?.modifier_class ?? "ADD");
  const [emptyDisplayAs, setEmptyDisplayAs] = useState(modifier_type.display_flags?.empty_display_as ?? "OMIT");
  const [templateString, setTemplateString] = useState(modifier_type.display_flags?.template_string ?? "");
  const [multipleItemSeparator, setMultipleItemSeparator] = useState(modifier_type.display_flags?.multiple_item_separator ?? "");
  const [nonEmptyGroupPrefix, setNonEmptyGroupPrefix] = useState(modifier_type.display_flags?.non_empty_group_prefix ?? "");
  const [nonEmptyGroupSuffix, setNonEmptyGroupSuffix] = useState(modifier_type.display_flags?.non_empty_group_suffix ?? "");
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const editModifierType = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/option/${modifier_type._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            display_name: displayName,
            ordinal: ordinal,
            min_selected: minSelected,
            max_selected: maxSelected || null,
            revelID: revelID,
            squareID: squareID,
            display_flags: {
              omit_options_if_not_available: omitOptionIfNotAvailable,
              omit_section_if_no_available_options: omitSectionIfNoAvailableOptions,
              use_toggle_if_only_two_options: (useToggleIfOnlyTwoOptions && minSelected === 1 && maxSelected === 1),
              empty_display_as: emptyDisplayAs,
              hidden: isHiddenDuringCustomization,
              modifier_class: modifierClass,
              template_string: templateString || "",
              multiple_item_separator: multipleItemSeparator || "",
              non_empty_group_prefix: nonEmptyGroupPrefix || "",
              non_empty_group_suffix: nonEmptyGroupSuffix || ""
            }
          }),
        });
        if (response.status === 200) {
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };

  return (
    <ModifierTypeComponent 
      actions={[ 
        <Button
          className="btn btn-light"
          onClick={onCloseCallback}
          disabled={isProcessing}>
          Cancel
        </Button>,                  
        <Button
          className="btn btn-light"
          onClick={editModifierType}
          disabled={name.length === 0 || (Number.isFinite(maxSelected) && maxSelected < minSelected) || (useToggleIfOnlyTwoOptions && (maxSelected!==1 && minSelected !== 1)) || isProcessing}
        >
          Save
        </Button>
      ]}
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
      templateString={templateString}
      setTemplateString={setTemplateString}
      multipleItemSeparator={multipleItemSeparator}
      setMultipleItemSeparator={setMultipleItemSeparator}
      nonEmptyGroupPrefix={nonEmptyGroupPrefix}
      setNonEmptyGroupPrefix={setNonEmptyGroupPrefix}
      nonEmptyGroupSuffix={nonEmptyGroupSuffix}
      setNonEmptyGroupSuffix={setNonEmptyGroupSuffix}
    />
  );
};

export default ModifierTypeEditContainer;
