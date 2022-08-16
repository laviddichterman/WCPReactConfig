import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ModifierOptionComponent from "./modifier_option.component";

import { HOST_API } from "../../../config";
import { IOptionType, IMoney, CURRENCY, IOption } from "@wcp/wcpshared";

export interface ModifierOptionUiContainerProps {
  parent: IOptionType;
  onCloseCallback: VoidFunction;
}

const ModifierOptionAddContainer = ({ parent, onCloseCallback }: ModifierOptionUiContainerProps) => {
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [ordinal, setOrdinal] = useState(0);
  const [price, setPrice] = useState<IMoney>({ amount: 0, currency: CURRENCY.USD });
  const [enableFunction, setEnableFunction] = useState<string | null>(null);
  const [flavorFactor, setFlavorFactor] = useState(0);
  const [bakeFactor, setBakeFactor] = useState(0);
  const [canSplit, setCanSplit] = useState(true);
  const [omitFromShortname, setOmitFromShortname] = useState(false);
  const [omitFromName, setOmitFromName] = useState(false);
  const [disabled, setDisabled] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addModifierOption = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body: Omit<IOption, "id" | 'modifierTypeId'> = {
          displayName,
          description,
          shortcode,
          disabled,
          price,
          ordinal,
          enable: enableFunction,
          externalIDs: {},
          metadata: {
            flavor_factor: flavorFactor,
            bake_factor: bakeFactor,
            can_split: canSplit,
          },
          displayFlags: {
            omit_from_shortname: omitFromShortname,
            omit_from_name: omitFromName
          }
        };
        const response = await fetch(`${HOST_API}/api/v1/menu/option/${parent.id}/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.status === 201) {
          setDisplayName("");
          setDescription("");
          setShortcode("");
          setOrdinal(0);
          setPrice({ amount: 0, currency: CURRENCY.USD });
          setEnableFunction(null);
          setFlavorFactor(0);
          setBakeFactor(0);
          setCanSplit(true);
          setOmitFromShortname(false);
          setOmitFromName(false);
          setDisabled(null);
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
      confirmText="Add"
      onCloseCallback={onCloseCallback}
      onConfirmClick={addModifierOption}
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
    />
  );
};

export default ModifierOptionAddContainer;
