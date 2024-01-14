import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import Grid from "@mui/material/Grid";
import { ElementActionComponent } from "../element.action.component";
import { HOST_API } from "../../../../config";

import { ProductQuickActionProps } from './product.delete.container';
import { IProduct } from "@wcp/wcpshared";
import { useSnackbar } from "notistack";
import { selectBaseProductName } from "../../../../redux/store";
import { useAppSelector } from "../../../../hooks/useRedux";
import { getProductEntryById } from "@wcp/wario-ux-shared";

const ProductEnableContainer = ({ product_id, onCloseCallback }: ProductQuickActionProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const productName = useAppSelector(s=>selectBaseProductName(s, product_id));
  const product = useAppSelector(s=>getProductEntryById(s.ws.products, product_id)!.product);

  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const editProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:catalog" } });
        const body: IProduct = {
          ...product,
          disabled: null
        };
        const response = await fetch(`${HOST_API}/api/v1/menu/product/${product_id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.status === 200) {
          enqueueSnackbar(`Enabled ${productName}.`)
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to update ${productName}. Got error: ${JSON.stringify(error, null, 2)}.`, { variant: "error" });
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