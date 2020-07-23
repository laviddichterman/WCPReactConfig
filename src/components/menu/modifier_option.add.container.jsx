import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ModifierOptionComponent from "./modifier_option.component";
import LinearProgress from '@material-ui/core/LinearProgress';
import { useAuth0 } from '@auth0/auth0-react';

const ModifierOptionAddContainer = ({ ENDPOINT, parent, onCloseCallback }) => {
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [ordinal, setOrdinal] = useState(0);
  const [price, setPrice] = useState(0);
  const [enableFunctionName, setEnableFunctionName] = useState("always");
  const [flavorFactor, setFlavorFactor] = useState(0);
  const [bakeFactor, setBakeFactor] = useState(0);
  const [canSplit, setCanSplit] = useState(true);
  const [disabled, setDisabled] = useState(null);
  const [revelID, setRevelID] = useState("");
  const [squareID, setSquareID] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addModifierOption = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/option/${parent._id}/`, {
          method: "POST",
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
        if (response.status === 201) {
          setDisplayName("");
          setDescription("");
          setShortcode("");
          setOrdinal(0);
          setPrice(0);
          setEnableFunctionName("always");
          setFlavorFactor(0);
          setBakeFactor(0);
          setCanSplit(true);
          setDisabled(null);
          setRevelID("");
          setSquareID("");  
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
          onClick={addModifierOption}
          disabled={displayName.length === 0 || shortcode.length === 0 ||
            price < 0 || flavorFactor < 0 || bakeFactor < 0 || isProcessing}
        >
          Add
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

export default ModifierOptionAddContainer;
