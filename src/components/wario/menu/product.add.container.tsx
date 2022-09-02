import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ProductComponent from "./product.component";
import { HOST_API } from "../../../config";
import { CURRENCY, IMoney, IProduct, IProductInstance, IProductModifier, IWInterval, KeyValue } from "@wcp/wcpshared";

export type ProductAddRequestType = Omit<IProductInstance, 'id' | 'displayFlags' | 'externalIDs' | 'modifiers' | 'isBase' | 'productId'> &
  Omit<IProduct, "id"> & { create_product_instance: boolean };

interface ProductAddContainerProps {
  onCloseCallback: VoidFunction;
}
const ProductAddContainer = ({ onCloseCallback }: ProductAddContainerProps) => {
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [price, setPrice] = useState<IMoney>({ amount: 0, currency: CURRENCY.USD });
  const [externalIds, setExternalIds] = useState<KeyValue[]>([]);
  const [disabled, setDisabled] = useState<IWInterval | null>(null);
  const [serviceDisable, setServiceDisable] = useState([]);
  const [ordinal, setOrdinal] = useState(0);
  const [flavorMax, setFlavorMax] = useState(10);
  const [bakeMax, setBakeMax] = useState(10);
  const [bakeDifferentialMax, setBakeDifferentialMax] = useState(100);
  const [orderGuideSuggestionFunctions, setOrderGuideSuggestionFunctions] = useState<string[]>([]);
  const [orderGuideWarningFunctions, setOrderGuideWarningFunctions] = useState<string[]>([]);
  const [showNameOfBaseProduct, setShowNameOfBaseProduct] = useState(true);
  const [singularNoun, setSingularNoun] = useState("");
  const [parentCategories, setParentCategories] = useState<string[]>([]);
  const [modifiers, setModifiers] = useState<IProductModifier[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body: ProductAddRequestType = {
          displayName,
          description,
          shortcode,
          disabled,
          serviceDisable,
          ordinal,
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
          modifiers: modifiers,
          create_product_instance: true
        };
        const response = await fetch(`${HOST_API}/api/v1/menu/product/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.status === 201) {
          setDisplayName("");
          setDescription("");
          setShortcode("");
          setPrice({ amount: 0, currency: CURRENCY.USD });
          setExternalIds([]);
          setDisabled(null);
          setServiceDisable([]);
          setOrdinal(0);
          setFlavorMax(10);
          setBakeMax(10);
          setBakeDifferentialMax(100);
          setOrderGuideSuggestionFunctions([]);
          setOrderGuideWarningFunctions([]);
          setShowNameOfBaseProduct(true);
          setSingularNoun("");
          setModifiers([]);
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
      suppressNonProductInstanceFields={false}
      onCloseCallback={onCloseCallback}
      onConfirmClick={addProduct}
      isProcessing={isProcessing}
      disableConfirmOn={displayName.length === 0 || shortcode.length === 0 || price.amount < 0 || isProcessing}
      displayName={displayName}
      setDisplayName={setDisplayName}
      description={description}
      setDescription={setDescription}
      shortcode={shortcode}
      setShortcode={setShortcode}
      externalIds={externalIds}
      setExternalIds={setExternalIds}
      price={price}
      setPrice={setPrice}
      disabled={disabled}
      setDisabled={setDisabled}
      serviceDisable={serviceDisable}
      setServiceDisable={setServiceDisable}
      ordinal={ordinal}
      setOrdinal={setOrdinal}
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

export default ProductAddContainer;
