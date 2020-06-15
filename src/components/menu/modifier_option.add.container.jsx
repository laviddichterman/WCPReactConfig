import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ModifierOptionComponent from "./modifier_option.component";
import { useAuth0 } from "../../react-auth0-spa";

const ModifierOptionAddContainer = ({ ENDPOINT, modifier_types }) => {
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [ordinal, setOrdinal] = useState(0);
  const [price, setPrice] = useState(0);
  const [enableFunctionName, setEnableFunctionName] = useState("");
  const [flavorFactor, setFlavorFactor] = useState(0);
  const [bakeFactor, setBakeFactor] = useState(0);
  const [canSplit, setCanSplit] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [revelID, setRevelID] = useState("");
  const [squareID, setSquareID] = useState("");
  const [parent, setParent] = useState(null);
  const [parentName, setParentName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { getTokenSilently } = useAuth0();

  const addModifierOption = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getTokenSilently();
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
            disabled: !enabled,
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
          setEnableFunctionName("");
          setFlavorFactor(0);
          setBakeFactor(0);
          setCanSplit(true);
          setEnabled(true);
          setParent(null);
          setParentName("");
          setRevelID("");
          setSquareID("");  
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
          onClick={addModifierOption}
          disabled={displayName.length === 0 || shortcode.length === 0 ||
            price < 0 || flavorFactor < 0 || bakeFactor < 0 || isProcessing}
        >
          Add
        </Button>
      ]}
      modifier_types={modifier_types}
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
      enabled={enabled}
      setEnabled={setEnabled}
      revelID={revelID}
      setRevelID={setRevelID}
      squareID={squareID}
      setSquareID={setSquareID}
      parent={parent}
      setParent={setParent}
      parentName={parentName}
      setParentName={setParentName}  
    />
  );
};

export default ModifierOptionAddContainer;
