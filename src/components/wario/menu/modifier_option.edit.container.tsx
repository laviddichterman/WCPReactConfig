import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ModifierOptionComponent from "./modifier_option.component";
import { HOST_API } from "../../../config";
import { IOption } from "@wcp/wcpshared";

interface ModifierOptionEditContainer { 
  modifier_option: IOption;
  onCloseCallback: VoidFunction;
}
const ModifierOptionEditContainer = ({modifier_option, onCloseCallback } : ModifierOptionEditContainer) => {
  const [displayName, setDisplayName] = useState(modifier_option.item.display_name);
  const [description, setDescription] = useState(modifier_option.item.description);
  const [shortcode, setShortcode] = useState(modifier_option.item.shortcode);
  const [ordinal, setOrdinal] = useState(modifier_option.ordinal);
  const [price, setPrice] = useState(modifier_option.item.price);
  const [enableFunction, setEnableFunction] = useState(modifier_option.enable_function ?? null);
  const [flavorFactor, setFlavorFactor] = useState(modifier_option.metadata.flavor_factor);
  const [bakeFactor, setBakeFactor] = useState(modifier_option.metadata.bake_factor);
  const [canSplit, setCanSplit] = useState(modifier_option.metadata.can_split);
  const [omitFromShortname, setOmitFromShortname] = useState(modifier_option.display_flags?.omit_from_shortname ?? false);
  const [omitFromName, setOmitFromName] = useState(modifier_option.display_flags?.omit_from_name ?? false);
  const [disabled, setDisabled] = useState(modifier_option.item?.disabled ?? null);
  const [revelID, setRevelID] = useState(modifier_option.item?.externalIDs?.revelID ?? "");
  const [squareID, setSquareID] = useState(modifier_option.item?.externalIDs?.squareID ?? "");
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const editModifierOption = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${HOST_API}/api/v1/menu/option/${modifier_option.option_type_id}/${modifier_option.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            display_name: displayName,
            description,
            shortcode,
            disabled,
            price,
            ordinal,
            enable_function: enableFunction ? enableFunction : null,
            flavor_factor: flavorFactor,
            bake_factor: bakeFactor,
            can_split: canSplit,
            revelID,
            squareID,
            display_flags: {
              omit_from_shortname: omitFromShortname,
              omit_from_name: omitFromName
            }
          }),
        });
        if (response.status === 200) {
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
    <ModifierOptionComponent 
      confirmText="Save"
      onCloseCallback={onCloseCallback}
      onConfirmClick={editModifierOption}
      isProcessing={isProcessing}
      displayName={displayName}
      setDisplayName={setDisplayName}
      description={description}
      setDescription={setDescription}
      shortcode={shortcode}
      setShortcode={setShortcode}
      ordinal={ordinal}
      setOrdinal={setOrdinal}
      price={price}
      setPrice={setPrice}
      enableFunction={enableFunction}
      setEnableFunction={setEnableFunction}
      flavorFactor={flavorFactor}
      setFlavorFactor={setFlavorFactor}
      bakeFactor={bakeFactor}
      setBakeFactor={setBakeFactor}
      canSplit={canSplit}
      setCanSplit={setCanSplit}
      omitFromShortname={omitFromShortname}
      setOmitFromShortname={setOmitFromShortname}
      omitFromName={omitFromName}
      setOmitFromName={setOmitFromName}
      disabled={disabled}
      setDisabled={setDisabled}
      revelID={revelID}
      setRevelID={setRevelID}
      squareID={squareID}
      setSquareID={setSquareID}
    />
  );
};

export default ModifierOptionEditContainer;