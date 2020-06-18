import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ModifierOptionComponent from "./modifier_option.component";
import LinearProgress from '@material-ui/core/LinearProgress';
import { useAuth0 } from "../../react-auth0-spa";

const ProductEditContainer = ({ ENDPOINT, modifier_types, categories, product }) => {
  const [displayName, setDisplayName] = useState(product.catalog_item.display_name);
  const [description, setDescription] = useState(product.catalog_item.description);
  const [shortcode, setShortcode] = useState(product.catalog_item.shortcode);
  const [price, setPrice] = useState(product.catalog_item.price.amount);
  const [enabled, setEnabled] = useState(!product.catalog_item.disabled);
  const [revelID, setRevelID] = useState(product.catalog_item.externalIDs && product.catalog_item.externalIDs.revelID ? product.catalog_item.externalIDs.revelID : "");
  const [squareID, setSquareID] = useState(product.catalog_item.externalIDs && product.catalog_item.externalIDs.squareID ? product.catalog_item.externalIDs.squareID : "");
  const [parentCategories, setParentCategories] = useState(categories.filter(x => product.category_ids.includes(x._id.ToString())));
  const [modifiers, setModifiers] = useState(modifier_types.filter(x => product.modifiers.includes(x._id.ToString())));

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
            category_ids: parentCategories.map(x => x._id),
            modifiers: modifiers.map(x => x._id)
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