import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import Grid from "@mui/material/Grid";
import { ElementActionComponent } from "../element.action.component";
import { HOST_API } from "../../../../config";

import { ProductQuickActionProps } from './product.delete.container';
import { IProduct } from "@wcp/wcpshared";
import { useSnackbar } from "notistack";

const ProductDisableContainer = ({ product, productName, onCloseCallback }: ProductQuickActionProps) => {
  const { enqueueSnackbar } = useSnackbar();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const editProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body: IProduct = {
          ...product,
          disabled: { start: 1, end: 0 }
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
          enqueueSnackbar(`Disabled ${productName}.`)
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
    <ElementActionComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={editProduct}
      isProcessing={isProcessing}
      disableConfirmOn={isProcessing}
      confirmText="Confirm"
      body={
        <Grid item xs={12}>
          Are you sure you'd like to disable {productName}?
        </Grid>
      }
    />
  );
};

export default ProductDisableContainer;