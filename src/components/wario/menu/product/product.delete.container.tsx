import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ElementDeleteComponent from "../element.delete.component";
import { HOST_API } from "../../../../config";
import { IProduct } from "@wcp/wcpshared";
import { useSnackbar } from "notistack";

export interface ProductQuickActionProps {
  product: IProduct;
  productName: string;
  onCloseCallback: VoidFunction;
}
const ProductDeleteContainer = ({ product, productName, onCloseCallback }: ProductQuickActionProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const deleteProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "delete:catalog" });
        const response = await fetch(`${HOST_API}/api/v1/menu/product/${product.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        if (response.status === 200) {
          enqueueSnackbar(`Deleted product: ${productName}.`)
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to delete ${productName}. Got error: ${JSON.stringify(error)}.`, { variant: "error" });
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <ElementDeleteComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={deleteProduct}
      name={productName}
      isProcessing={isProcessing}
    />
  );
};

export default ProductDeleteContainer;
