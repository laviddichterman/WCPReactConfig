import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import Grid from "@mui/material/Grid";
import { ElementActionComponent } from "./element.action.component";
import { HOST_API } from "../../../config";

import { ProductQuickActionProps } from './product.delete.container';
import { IProduct } from "@wcp/wcpshared";

const ProductEnableContainer = ({ product, productName, onCloseCallback }: ProductQuickActionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const editProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const response = await fetch(`${HOST_API}/api/v1/menu/product/${product.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            disabled: null,
            service_disable: product.service_disable,
            price: product.price,
            display_flags: product.display_flags,
            category_ids: product.category_ids,
            modifiers: product.modifiers,
          } as IProduct),
        });
        if (response.status === 200) {
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };

  return (
    <ElementActionComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={editProduct}
      isProcessing={isProcessing}
      disableConfirmOn={isProcessing}
      confirmText="Confirm"
      body={
        <Grid item xs={12}>
          Are you sure you'd like to enable {productName}?
        </Grid>
      }
    />
  );
};

export default ProductEnableContainer;