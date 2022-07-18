import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ProductComponent from "./product.component";
import { HOST_API } from "../../../config";
import { CURRENCY, IMoney, IWInterval } from "@wcp/wcpshared";

interface ProductAddContainerProps { 
  onCloseCallback: VoidFunction;
}
const ProductAddContainer = ({ onCloseCallback } : ProductAddContainerProps) => {
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [price, setPrice] = useState<IMoney>({ amount: 0, currency: CURRENCY.USD });
  const [disabled, setDisabled] = useState<IWInterval | null>(null);
  const [serviceDisabled, setServiceDisabled] = useState([]);
  const [ordinal, setOrdinal] = useState(0);
  const [flavorMax, setFlavorMax] = useState(10);
  const [bakeMax, setBakeMax] = useState(10);
  const [bakeDifferentialMax, setBakeDifferentialMax] = useState(100);
  const [showNameOfBaseProduct, setShowNameOfBaseProduct] = useState(true);
  const [singularNoun, setSingularNoun] = useState("");
  const [parentCategories, setParentCategories] = useState<string[]>([]);
  const [modifiers, setModifiers] = useState<{ mtid: string, enable: string | null }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${HOST_API}/api/v1/menu/product/`, {
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
            create_product_instance: true
          }),
        });
        if (response.status === 201) {
          setDisplayName("");
          setDescription("");
          setShortcode("");
          setPrice({amount: 0, currency: CURRENCY.USD});
          setDisabled(null);
          setServiceDisabled([]);
          setOrdinal(0);
          setFlavorMax(10);
          setBakeMax(10);  
          setBakeDifferentialMax(100);
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
    />
  );
};

export default ProductAddContainer;
