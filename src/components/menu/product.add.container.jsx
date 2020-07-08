import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ProductComponent from "./product.component";
import LinearProgress from '@material-ui/core/LinearProgress';
import { useAuth0 } from "../../react-auth0-spa";

const ProductAddContainer = ({ ENDPOINT, modifier_types, categories, onCloseCallback }) => {
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [price, setPrice] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [ordinal, setOrdinal] = useState(0);
  const [revelID, setRevelID] = useState("");
  const [squareID, setSquareID] = useState("");
  const [parentCategories, setParentCategories] = useState([]);
  const [modifiers, setModifiers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getTokenSilently } = useAuth0();

  const addProduct = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/product/`, {
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
            ordinal: ordinal,
            price: { amount: price * 100, currency: "USD" },
            revelID: revelID,
            squareID: squareID,
            category_ids: parentCategories.map(x => x.category._id),
            modifiers: modifiers.map(x => x.modifier_type._id),
            create_product_instance: true
          }),
        });
        if (response.status === 201) {
          setDisplayName("");
          setDescription("");
          setShortcode("");
          setPrice(0);
          setEnabled(true);
          setOrdinal(0);
          setRevelID("");
          setSquareID("");  
          setModifiers([]);
          setParentCategories([]);
          onCloseCallback();
        }
        setIsProcessing(false);
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
          onClick={addProduct}
          disabled={displayName.length === 0 || shortcode.length === 0 ||
            price < 0 || isProcessing}
        >
          Add
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
      ordinal={ordinal}
      setOrdinal={setOrdinal}
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

export default ProductAddContainer;
