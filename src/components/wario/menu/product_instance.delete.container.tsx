import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ElementDeleteComponent  from "./element.delete.component";

const ProductInstanceDeleteContainer = ({ ENDPOINT, product_instance, onCloseCallback }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const deleteProductInstance = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "delete:catalog"} );
        const response = await fetch(`${ENDPOINT}/api/v1/menu/product/${product_instance.product_id}/${product_instance._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
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
    <ElementDeleteComponent 
      onCloseCallback={onCloseCallback}
      onConfirmClick={deleteProductInstance}
      name={product_instance.item.display_name}
      isProcessing={isProcessing}
    />
  );
};

export default ProductInstanceDeleteContainer;
