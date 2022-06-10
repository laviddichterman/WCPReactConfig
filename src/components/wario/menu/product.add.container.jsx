import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ProductComponent from "./product.component";

const ProductAddContainer = ({ ENDPOINT, modifier_types, services, product_instance_functions, categories, onCloseCallback }) => {
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [price, setPrice] = useState(0);
  const [disabled, setDisabled] = useState(null);
  const [serviceDisabled, setServiceDisabled] = useState([]);
  const [ordinal, setOrdinal] = useState(0);
  const [flavorMax, setFlavorMax] = useState(10);
  const [bakeMax, setBakeMax] = useState(10);
  const [bakeDifferentialMax, setBakeDifferentialMax] = useState(100);
  const [showNameOfBaseProduct, setShowNameOfBaseProduct] = useState(true);
  const [singularNoun, setSingularNoun] = useState("");
  const [parentCategories, setParentCategories] = useState([]);
  const [modifiers, setModifiers] = useState([]);
  const [modifierEnableFunctions, setModifierEnableFunctions] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addProduct = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${ENDPOINT}/api/v1/menu/product/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            display_name: displayName,
            description,
            shortcode,
            disabled,
            service_disable: serviceDisabled,
            ordinal,
            price: { amount: price * 100, currency: "USD" },
            display_flags: {
              bake_differential: bakeDifferentialMax,
              show_name_of_base_product: showNameOfBaseProduct,
              flavor_max: flavorMax,
              bake_max: bakeMax,
              singular_noun: singularNoun,
            },
            category_ids: parentCategories.map(x => x.category._id),
            modifiers: modifiers.map(x => ({ mtid: x.modifier_type._id, enable: Object.hasOwn(modifierEnableFunctions, x.modifier_type._id) && modifierEnableFunctions[x.modifier_type._id] !== null ? modifierEnableFunctions[x.modifier_type._id]._id : null }) ),
            create_product_instance: true
          }),
        });
        if (response.status === 201) {
          setDisplayName("");
          setDescription("");
          setShortcode("");
          setPrice(0);
          setDisabled(null);
          setServiceDisabled([]);
          setOrdinal(0);
          setFlavorMax(10);
          setBakeMax(10);  
          setBakeDifferentialMax(100);
          setShowNameOfBaseProduct(true);
          setSingularNoun("");
          setModifiers([]);
          setModifierEnableFunctions({});
          setParentCategories([]);
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
    <ProductComponent 
      confirmText="Add"
      onCloseCallback={onCloseCallback}
      onConfirmClick={addProduct}
      isProcessing={isProcessing}
      disableConfirmOn={displayName.length === 0 || shortcode.length === 0 || price < 0 || isProcessing}
      modifier_types={modifier_types}
      product_instance_functions={product_instance_functions}
      services={services}
      categories={categories}
      displayName={displayName}
      setDisplayName={setDisplayName}
      description={description}
      setDescription={setDescription}
      shortcode={shortcode}
      setShortcode={setShortcode}
      price={price}
      setPrice={setPrice}
      disabled={disabled}
      setDisabled={setDisabled}
      serviceDisabled={serviceDisabled}
      setServiceDisabled={setServiceDisabled}
      ordinal={ordinal}
      setOrdinal={setOrdinal}
      flavorMax={flavorMax}
      setFlavorMax={setFlavorMax}
      bakeMax={bakeMax}
      setBakeMax={setBakeMax}
      bakeDifferentialMax={bakeDifferentialMax}
      setBakeDifferentialMax={setBakeDifferentialMax}
      showNameOfBaseProduct={showNameOfBaseProduct}
      setShowNameOfBaseProduct={setShowNameOfBaseProduct}
      singularNoun={singularNoun}
      setSingularNoun={setSingularNoun}
      parentCategories={parentCategories}
      setParentCategories={setParentCategories}
      modifiers={modifiers}
      setModifiers={setModifiers}
      modifierEnableFunctions={modifierEnableFunctions}
      setModifierEnableFunctions={setModifierEnableFunctions}
    />
  );
};

export default ProductAddContainer;
