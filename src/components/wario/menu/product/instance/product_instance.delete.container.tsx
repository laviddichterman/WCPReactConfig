import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { IProductInstance } from "@wcp/wcpshared";
import ElementDeleteComponent from "../../element.delete.component";
import { HOST_API } from "../../../../../config";
import { useSnackbar } from "notistack";

export interface ProductInstanceQuickActionProps {
  product_instance: IProductInstance;
  onCloseCallback: VoidFunction;
}

const ProductInstanceDeleteContainer = ({ product_instance, onCloseCallback }: ProductInstanceQuickActionProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const deleteProductInstance = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ authorizationParams: { scope: "delete:catalog" } });
        const response = await fetch(`${HOST_API}/api/v1/menu/product/${product_instance.productId}/${product_instance.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        if (response.status === 200) {
          enqueueSnackbar(`Deleted product: ${product_instance.displayName}.`)
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to delete ${product_instance.displayName}. Got error: ${JSON.stringify(error)}.`, { variant: "error" });
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <ElementDeleteComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={deleteProductInstance}
      name={product_instance.displayName}
      isProcessing={isProcessing}
    />
  );
};

export default ProductInstanceDeleteContainer;
