import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ProductComponent from "./product.component";
import { HOST_API } from "../../../config";
import { IProduct } from "@wcp/wcpshared";

export interface ProductEditContainerProps {
  product: IProduct;
  onCloseCallback: VoidFunction;
};

const ProductEditContainer = ({ product, onCloseCallback }: ProductEditContainerProps) => {
  const [price, setPrice] = useState(product.price);
  const [disabled, setDisabled] = useState(product.disabled ?? null);
  const [serviceDisable, setServiceDisable] = useState(product.serviceDisable)
  const [flavorMax, setFlavorMax] = useState(product.displayFlags.flavor_max ?? 10);
  const [bakeMax, setBakeMax] = useState(product.displayFlags.bake_max ?? 10);
  const [bakeDifferentialMax, setBakeDifferentialMax] = useState(product.displayFlags.bake_differential ?? 100);
  const [orderGuideSuggestionFunctions, setOrderGuideSuggestionFunctions] = useState(product.displayFlags.order_guide.suggestions);
  const [orderGuideWarningFunctions, setOrderGuideWarningFunctions] = useState(product.displayFlags.order_guide.warnings);
  const [showNameOfBaseProduct, setShowNameOfBaseProduct] = useState(product.displayFlags.show_name_of_base_product ?? true);
  const [singularNoun, setSingularNoun] = useState(product.displayFlags.singular_noun ?? "");
  const [parentCategories, setParentCategories] = useState(product.category_ids);
  const [modifiers, setModifiers] = useState(product.modifiers);
  // create an Object mapping MTID to enable function object
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const editProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body: Omit<IProduct, "id"> = {
          disabled,
          serviceDisable,
          price,
          externalIDs: {},
          displayFlags: {
            bake_differential: bakeDifferentialMax,
            show_name_of_base_product: showNameOfBaseProduct,
            flavor_max: flavorMax,
            bake_max: bakeMax,
            singular_noun: singularNoun,
            order_guide: { 
              suggestions: orderGuideSuggestionFunctions,
              warnings: orderGuideWarningFunctions
            }
          },
          category_ids: parentCategories,
          modifiers: modifiers,
        };
        const response = await fetch(`${HOST_API}/api/v1/menu/product/${product.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
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
      serviceDisable={serviceDisable}
      setServiceDisable={setServiceDisable}
      flavorMax={flavorMax}
      setFlavorMax={setFlavorMax}
      bakeMax={bakeMax}
      setBakeMax={setBakeMax}
      bakeDifferentialMax={bakeDifferentialMax}
      setBakeDifferentialMax={setBakeDifferentialMax}
      orderGuideSuggestionFunctions={orderGuideSuggestionFunctions}
      setOrderGuideSuggestionFunctions={setOrderGuideSuggestionFunctions}
      orderGuideWarningFunctions={orderGuideWarningFunctions}
      setOrderGuideWarningFunctions={setOrderGuideWarningFunctions}
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