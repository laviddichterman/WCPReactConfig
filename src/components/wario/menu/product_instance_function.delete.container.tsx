import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ElementDeleteComponent from "./element.delete.component";
import { HOST_API } from "../../../config";
import { IProductInstanceFunction } from "@wcp/wcpshared";

export interface ProductInstanceFunctionQuickActionProps { 
  product_instance_function: IProductInstanceFunction;
  onCloseCallback: VoidFunction;
}

const ProductInstanceFunctionDeleteContainer = ({ product_instance_function, onCloseCallback } : ProductInstanceFunctionQuickActionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const deletePIF = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "delete:catalog"} );
        const response = await fetch(`${HOST_API}/api/v1/query/language/productinstancefunction/${product_instance_function.id}`, {
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
      onConfirmClick={deletePIF}
      name={product_instance_function.name}
      isProcessing={isProcessing}
    />    
  );
};

export default ProductInstanceFunctionDeleteContainer;
