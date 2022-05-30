import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ProductComponent from "./product.component";

const ProductEditContainer = ({ ENDPOINT, modifier_types, services, product_instance_functions, categories, product, onCloseCallback }) => {
  const [price, setPrice] = useState((product.price?.amount ?? 0) / 100);
  const [disabled, setDisabled] = useState(product.disabled);
  const [serviceDisabled, setServiceDisabled] = useState(product.service_disable)
  const [revelID, setRevelID] = useState(product.item?.externalIDs?.revelID ?? "");
  const [squareID, setSquareID] = useState(product.item?.externalIDs?.squareID ?? "");
  const [flavorMax, setFlavorMax] = useState(product.display_flags?.flavor_max ?? 10);
  const [bakeMax, setBakeMax] = useState(product.display_flags?.bake_max ?? 10);
  const [bakeDifferentialMax, setBakeDifferentialMax] = useState(product.display_flags?.bake_differential ?? 100);
  const [showNameOfBaseProduct, setShowNameOfBaseProduct] = useState(product.display_flags?.show_name_of_base_product ?? true);
  const [singularNoun, setSingularNoun] = useState(product.display_flags?.singular_noun ?? "");
  const [parentCategories, setParentCategories] = useState(Object.values(categories).filter(x => product.category_ids.includes(x.category._id.toString())));
  const [modifiers, setModifiers] = useState(product.modifiers.map((v) => Object.values(modifier_types).find(x => x.modifier_type._id.toString() === v.mtid)));
  // create an Object mapping MTID to enable function object
  const [modifierEnableFunctions, setModifierEnableFunctions] = useState(product.modifiers.reduce((o, entry) => Object.assign(o, {[entry.mtid]: entry.enable ?? null }), {}));
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const editProduct = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${ENDPOINT}/api/v1/menu/product/${product._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            disabled,
            service_disable: serviceDisabled,
            price: { amount: price  * 100, currency: "USD" },
            revelID,
            squareID,
            display_flags: {
              bake_differential: bakeDifferentialMax,
              show_name_of_base_product: showNameOfBaseProduct,
              flavor_max: flavorMax,
              bake_max: bakeMax,
              singular_noun: singularNoun,
            },
            category_ids: parentCategories.map(x => x.category._id),
            modifiers: modifiers.map(x => ({ mtid: x.modifier_type._id, enable: Object.hasOwn(modifierEnableFunctions, x.modifier_type._id) && modifierEnableFunctions[x.modifier_type._id] !== null ? modifierEnableFunctions[x.modifier_type._id]._id : null }) ),
          }),
        });
        if (response.status === 200) {
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
      confirmText="Save"
      onCloseCallback={onCloseCallback}
      onConfirmClick={editProduct}
      isProcessing={isProcessing}
      disableConfirmOn={price < 0 || isProcessing}
      modifier_types={modifier_types}
      services={services}
      product_instance_functions={product_instance_functions}
      categories={categories}
      suppressNonProductInstanceFields
      price={price}
      setPrice={setPrice}
      disabled={disabled}
      setDisabled={setDisabled}
      serviceDisabled={serviceDisabled}
      setServiceDisabled={setServiceDisabled}
      revelID={revelID}
      setRevelID={setRevelID}
      squareID={squareID}
      setSquareID={setSquareID}
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

export default ProductEditContainer;