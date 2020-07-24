import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ModifierOptionComponent from "./modifier_option.component";
import LinearProgress from '@material-ui/core/LinearProgress';
import { useAuth0 } from '@auth0/auth0-react';

const ModifierOptionEditContainer = ({ ENDPOINT, modifier_option, onCloseCallback }) => {
  const [displayName, setDisplayName] = useState(modifier_option.item.display_name);
  const [description, setDescription] = useState(modifier_option.item.description);
  const [shortcode, setShortcode] = useState(modifier_option.item.shortcode);
  const [ordinal, setOrdinal] = useState(modifier_option.ordinal);
  const [price, setPrice] = useState(modifier_option.item.price.amount / 100);
  const [enableFunctionName, setEnableFunctionName] = useState(modifier_option.enable_function_name);
  const [flavorFactor, setFlavorFactor] = useState(modifier_option.metadata.flavor_factor);
  const [bakeFactor, setBakeFactor] = useState(modifier_option.metadata.bake_factor);
  const [canSplit, setCanSplit] = useState(modifier_option.metadata.can_split);
  const [disabled, setDisabled] = useState(modifier_option.item?.disabled ?? null);
  const [revelID, setRevelID] = useState(modifier_option.item?.externalIDs?.revelID ?? "");
  const [squareID, setSquareID] = useState(modifier_option.item?.externalIDs?.squareID ?? "");
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
console.log(modifier_option.item.disabled);
  const editModifierOption = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/option/${modifier_option.option_type_id}/${modifier_option._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            display_name: displayName,
            description: description,
            shortcode: shortcode,
            disabled: disabled,
            price: { amount: price * 100, currency: "USD" },
            ordinal: ordinal,
            enable_function_name: enableFunctionName,
            flavor_factor: flavorFactor,
            bake_factor: bakeFactor,
            can_split: canSplit,
            revelID: revelID,
            squareID: squareID,
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
    <ModifierOptionComponent 
      actions={[  
        <Button
          className="btn btn-light"
          onClick={onCloseCallback}
          disabled={isProcessing}>
          Cancel
        </Button>,                 
        <Button
          className="btn btn-light"
          onClick={editModifierOption}
          disabled={displayName.length === 0 || shortcode.length === 0 ||
            price < 0 || flavorFactor < 0 || bakeFactor < 0 || isProcessing}
        >
          Save
        </Button>
      ]}
      progress={isProcessing ? <LinearProgress /> : "" }
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
      enableFunctionName={enableFunctionName}
      setEnableFunctionName={setEnableFunctionName}
      flavorFactor={flavorFactor}
      setFlavorFactor={setFlavorFactor}
      bakeFactor={bakeFactor}
      setBakeFactor={setBakeFactor}
      canSplit={canSplit}
      setCanSplit={setCanSplit}
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