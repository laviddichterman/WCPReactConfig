import React, { useState } from "react";

import Button from "@mui/material/Button";
import ModifierOptionComponent from "./modifier_option.component";
import LinearProgress from '@mui/material/LinearProgress';
import { useAuth0 } from '@auth0/auth0-react';

const ModifierOptionAddContainer = ({ ENDPOINT, product_instance_functions, parent, onCloseCallback }) => {
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [ordinal, setOrdinal] = useState(0);
  const [price, setPrice] = useState(0);
  const [enableFunction, setEnableFunction] = useState(null);
  const [flavorFactor, setFlavorFactor] = useState(0);
  const [bakeFactor, setBakeFactor] = useState(0);
  const [canSplit, setCanSplit] = useState(true);
  const [omitFromShortname, setOmitFromShortname] = useState(false);
  const [omitFromName, setOmitFromName] = useState(false);
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
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
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
            enable_function: enableFunction ? enableFunction._id : null,
            flavor_factor: flavorFactor,
            bake_factor: bakeFactor,
            can_split: canSplit,
            revelID: revelID,
            squareID: squareID,
            display_flags: {
              omit_from_shortname: omitFromShortname,
              omit_from_name: omitFromName
            }
          }),
        });
        if (response.status === 201) {
          setDisplayName("");
          setDescription("");
          setShortcode("");
          setOrdinal(0);
          setPrice(0);
          setEnableFunction(null);
          setFlavorFactor(0);
          setBakeFactor(0);
          setCanSplit(true);
          setOmitFromShortname(false);
          setOmitFromName(false);
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
      product_instance_functions={product_instance_functions}
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

export default ModifierOptionAddContainer;
