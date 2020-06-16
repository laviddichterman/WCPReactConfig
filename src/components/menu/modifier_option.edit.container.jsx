import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ModifierOptionComponent from "./modifier_option.component";
import LinearProgress from '@material-ui/core/LinearProgress';
import { useAuth0 } from "../../react-auth0-spa";

const ModifierOptionEditContainer = ({ ENDPOINT, modifier_types, modifier_option }) => {
  const foundParent = modifier_types.find(x => x._id === modifier_option.option_type_id);

  const [displayName, setDisplayName] = useState(modifier_option.catalog_item.display_name);
  const [description, setDescription] = useState(modifier_option.catalog_item.description);
  const [shortcode, setShortcode] = useState(modifier_option.catalog_item.shortcode);
  const [ordinal, setOrdinal] = useState(modifier_option.ordinal);
  const [price, setPrice] = useState(modifier_option.catalog_item.price.amount);
  const [enableFunctionName, setEnableFunctionName] = useState(modifier_option.enable_function_name);
  const [flavorFactor, setFlavorFactor] = useState(modifier_option.metadata.flavor_factor);
  const [bakeFactor, setBakeFactor] = useState(modifier_option.metadata.bake_factor);
  const [canSplit, setCanSplit] = useState(modifier_option.metadata.can_split);
  const [enabled, setEnabled] = useState(!modifier_option.catalog_item.disabled);
  const [revelID, setRevelID] = useState(modifier_option.externalIDs && modifier_option.externalIDs.revelID ? modifier_option.externalIDs.revelID : "");
  const [squareID, setSquareID] = useState(modifier_option.externalIDs && modifier_option.externalIDs.squareID ? modifier_option.externalIDs.squareID : "");
  const [parent, setParent] = useState(foundParent);
  const [parentName, setParentName] = useState(foundParent.name);

  const [isProcessing, setIsProcessing] = useState(false);
  const { getTokenSilently } = useAuth0();

  const editModifierOption = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getTokenSilently();
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
          onClick={editModifierOption}
          disabled={displayName.length === 0 || shortcode.length === 0 ||
            price < 0 || flavorFactor < 0 || bakeFactor < 0 || isProcessing}
        >
          Save
        </Button>
      ]}
      progress={isProcessing ? <LinearProgress /> : "" }
      modifier_types={[foundParent]}
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

export default ModifierOptionEditContainer;
