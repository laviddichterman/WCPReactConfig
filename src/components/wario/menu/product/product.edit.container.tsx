import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ProductComponent from "./product.component";
import { HOST_API } from "../../../../config";
import { IProduct } from "@wcp/wcpshared";
import { useSnackbar } from "notistack";
import { useAppSelector } from "src/hooks/useRedux";
import { getProductInstanceById } from "@wcp/wario-ux-shared";

export interface ProductEditContainerProps {
  product: IProduct;
  onCloseCallback: VoidFunction;
};

const ProductEditContainer = ({ product, onCloseCallback }: ProductEditContainerProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const productName = useAppSelector(s=> getProductInstanceById(s.ws.productInstances, product.baseProductId)?.displayName)
  
  const [price, setPrice] = useState(product.price);
  const [baseProductId, setBaseProductId] = useState(product.baseProductId);
  const [externalIds, setExternalIds] = useState(product.externalIDs);
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
  const [printerGroup, setPrinterGroup] = useState(product.printerGroup);
  const [modifiers, setModifiers] = useState(product.modifiers);
  // create an Object mapping MTID to enable function object
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const editProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body: Omit<IProduct, 'id'> = {
          disabled,
          serviceDisable,
          price,
          externalIDs: externalIds,
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
          printerGroup,
          modifiers: modifiers,
          baseProductId
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
          enqueueSnackbar(`Updated ${productName}.`)
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to update ${productName}. Got error: ${JSON.stringify(error)}.`, { variant: "error" });
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <ProductComponent
      confirmText="Save"
      isEdit
      onCloseCallback={onCloseCallback}
      onConfirmClick={editProduct}
      isProcessing={isProcessing}
      disableConfirmOn={price.amount < 0 || isProcessing}
      baseProductId={baseProductId}
      setBaseProductId={setBaseProductId}
      price={price}
      setPrice={setPrice}
      externalIds={externalIds}
      setExternalIds={setExternalIds}
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
      printerGroup={printerGroup}
      setPrinterGroup={setPrinterGroup}
      modifiers={modifiers}
      setModifiers={setModifiers}
    />
  );
};

export default ProductEditContainer;