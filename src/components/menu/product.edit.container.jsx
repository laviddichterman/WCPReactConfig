import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ProductComponent from "./product.component";
import LinearProgress from '@material-ui/core/LinearProgress';
import { useAuth0 } from "../../react-auth0-spa";

const ProductEditContainer = ({ ENDPOINT, modifier_types, categories, product, onCloseCallback }) => {
  const [displayName, setDisplayName] = useState(product.item.display_name);
  const [description, setDescription] = useState(product.item.description);
  const [shortcode, setShortcode] = useState(product.item.shortcode);
  const [price, setPrice] = useState(product.item.price.amount / 100);
  const [enabled, setEnabled] = useState(!product.item.disabled);
  const [revelID, setRevelID] = useState(product.item.externalIDs && product.item.externalIDs.revelID ? product.item.externalIDs.revelID : "");
  const [squareID, setSquareID] = useState(product.item.externalIDs && product.item.externalIDs.squareID ? product.item.externalIDs.squareID : "");
  const [parentCategories, setParentCategories] = useState(Object.values(categories).filter(x => product.category_ids.includes(x.category._id.toString())));
  const [modifiers, setModifiers] = useState(product.modifiers.map((v, i) => Object.values(modifier_types).find(x => x.modifier_type._id.toString() === v)));

  const [isProcessing, setIsProcessing] = useState(false);
  const { getTokenSilently } = useAuth0();

  const editProduct = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/product/${product._id}`, {
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
            category_ids: parentCategories.map(x => x.category._id),
            modifiers: modifiers.map(x => x.modifier_type._id)
          }),
        });
        setIsProcessing(false);
        onCloseCallback();
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };

  return (
    <ProductComponent 
      actions={[ 
        <Button
          className="btn btn-light"
          onClick={onCloseCallback}
          disabled={isProcessing}>
          Cancel
        </Button>,                 
        <Button
          className="btn btn-light"
          onClick={editProduct}
          disabled={displayName.length === 0 || shortcode.length === 0 ||
            price < 0 || isProcessing}
        >
          Save
        </Button>
      ]}
      progress={isProcessing ? <LinearProgress /> : "" }
      modifier_types={modifier_types}
      categories={categories}
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
      parentCategories={parentCategories}
      setParentCategories={setParentCategories}
      modifiers={modifiers}
      setModifiers={setModifiers} 
    />
  );
};

export default ProductEditContainer;