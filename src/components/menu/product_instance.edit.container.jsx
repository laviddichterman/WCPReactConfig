import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ProductInstanceContainer from "./product_instance.component";
import LinearProgress from '@material-ui/core/LinearProgress';
import { useAuth0 } from "../../react-auth0-spa";

const ProductInstanceEditContainer = ({ ENDPOINT, modifier_types_map, parent_product, product_instance, onCloseCallback}) => {
  const [displayName, setDisplayName] = useState(product_instance.item.display_name);
  const [description, setDescription] = useState(product_instance.item.description);
  const [shortcode, setShortcode] = useState(product_instance.item.shortcode);
  const [price, setPrice] = useState(product_instance.item.price.amount / 100);
  const [enabled, setEnabled] = useState(!product_instance.item.disabled);
  const [revelID, setRevelID] = useState(product_instance.item.externalIDs && product_instance.item.externalIDs.revelID ? product_instance.item.externalIDs.revelID : "");
  const [squareID, setSquareID] = useState(product_instance.item.externalIDs && product_instance.item.externalIDs.squareID ? product_instance.item.externalIDs.squareID : "");
  const [modifiers, setModifiers] = useState(product_instance.modifiers);

  const [isProcessing, setIsProcessing] = useState(false);
  const { getTokenSilently } = useAuth0();

  const editProductInstance = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/product/${parent_product._id}/${product_instance._id}`, {
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
            revelID: revelID,
            squareID: squareID,
            modifiers: modifiers
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
    <ProductInstanceContainer 
      actions={[  
        <Button
          className="btn btn-light"
          onClick={onCloseCallback}
          disabled={isProcessing}>
          Cancel
        </Button>,                  
        <Button
          className="btn btn-light"
          onClick={editProductInstance}
          disabled={displayName.length === 0 || shortcode.length === 0 ||
            price < 0 || isProcessing}
        >
          Save
        </Button>
      ]}
      progress={isProcessing ? <LinearProgress /> : "" }
      modifier_types_map={modifier_types_map}
      parent_product={parent_product}
      displayName={displayName}
      setDisplayName={setDisplayName}
      description={description}
      setDescription={setDescription}
      shortcode={shortcode}
      setShortcode={setShortcode}
      price={price}
      setPrice={setPrice}
      enabled={enabled}
      setEnabled={setEnabled}
      revelID={revelID}
      setRevelID={setRevelID}
      squareID={squareID}
      setSquareID={setSquareID}
      modifiers={modifiers}
      setModifiers={setModifiers} 
    />
  );
};

export default ProductInstanceEditContainer;