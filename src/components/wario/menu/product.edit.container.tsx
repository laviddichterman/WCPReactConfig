import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ProductComponent from "./product.component";
import { HOST_API } from "../../../config";
import { IProduct } from "@wcp/wcpshared";

export interface ProductEditContainerProps {
  product: IProduct;
  onCloseCallback: VoidFunction;
};

const ProductEditContainer = ({ product, onCloseCallback } : ProductEditContainerProps) => {
  const [price, setPrice] = useState(product.price);
  const [disabled, setDisabled] = useState(product.disabled ?? null);
  const [serviceDisabled, setServiceDisabled] = useState(product.service_disable)
  const [flavorMax, setFlavorMax] = useState(product.display_flags?.flavor_max ?? 10);
  const [bakeMax, setBakeMax] = useState(product.display_flags?.bake_max ?? 10);
  const [bakeDifferentialMax, setBakeDifferentialMax] = useState(product.display_flags?.bake_differential ?? 100);
  const [showNameOfBaseProduct, setShowNameOfBaseProduct] = useState(product.display_flags?.show_name_of_base_product ?? true);
  const [singularNoun, setSingularNoun] = useState(product.display_flags?.singular_noun ?? "");
  const [parentCategories, setParentCategories] = useState(product.category_ids);
  const [modifiers, setModifiers] = useState(product.modifiers);
  // create an Object mapping MTID to enable function object
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const editProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${HOST_API}/api/v1/menu/product/${product.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            disabled,
            service_disable: serviceDisabled,
            price,
            display_flags: {
              bake_differential: bakeDifferentialMax,
              show_name_of_base_product: showNameOfBaseProduct,
              flavor_max: flavorMax,
              bake_max: bakeMax,
              singular_noun: singularNoun,
            },
            category_ids: parentCategories,
            modifiers: modifiers,
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
      disableConfirmOn={price.amount < 0 || isProcessing}
      suppressNonProductInstanceFields
      price={price}
      setPrice={setPrice}
      disabled={disabled}
      setDisabled={setDisabled}
      serviceDisabled={serviceDisabled}
      setServiceDisabled={setServiceDisabled}
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
    />
  );
};

export default ProductEditContainer;