import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { Grid } from "@mui/material";
import { HOST_API } from "../../../../config";
import { ElementActionComponent } from "../element.action.component";

import { getProductEntryById } from "@wcp/wario-ux-shared";
import { IProduct } from "@wcp/wcpshared";
import { useSnackbar } from "notistack";
import { useAppSelector } from "../../../../hooks/useRedux";
import { selectBaseProductName } from "../../../../redux/store";
import { ProductQuickActionProps } from './product.delete.container';

const ProductDisableContainer = ({ product_id, onCloseCallback }: ProductQuickActionProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const productName = useAppSelector(s => selectBaseProductName(s, product_id));
  const product = useAppSelector(s => getProductEntryById(s.ws.products, product_id)!.product);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const editProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:catalog" } });
        const body: IProduct = {
          ...product,
          disabled: { start: 1, end: 0 }
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
          enqueueSnackbar(`Disabled ${productName}.`)
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to update ${productName}. Got error: ${JSON.stringify(error, null, 2)}.`, { variant: "error" });
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