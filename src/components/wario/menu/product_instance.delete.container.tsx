import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ElementDeleteComponent from "./element.delete.component";
import { HOST_API } from "src/config";
import { IProductInstance } from "@wcp/wcpshared";

export interface ProductInstanceQuickActionProps {
  product_instance: IProductInstance;
  onCloseCallback: VoidFunction;
}

const ProductInstanceDeleteContainer = ({ product_instance, onCloseCallback }: ProductInstanceQuickActionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const deleteProductInstance = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "delete:catalog" });
        const response = await fetch(`${HOST_API}/api/v1/menu/product/${product_instance.product_id}/${product_instance.id}`, {
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
