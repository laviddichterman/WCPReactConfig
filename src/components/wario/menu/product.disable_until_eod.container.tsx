import React, { useState } from "react";
import { getTime, endOfDay } from 'date-fns';
import { useAuth0 } from '@auth0/auth0-react';
import Grid from "@mui/material/Grid";
import { ElementActionComponent } from "./element.action.component";
import { HOST_API } from "../../../config";
import { useAppSelector } from "../../../hooks/useRedux";
import { ProductQuickActionProps } from './product.delete.container';
import { IProduct } from "@wcp/wcpshared";

const ProductDisableUntilEodContainer = ({ product, productName, onCloseCallback }: ProductQuickActionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const CURRENT_TIME = useAppSelector(s=>s.ws.currentTime);
  const { getAccessTokenSilently } = useAuth0();
  const editProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        const body: IProduct = {
          ...product,
          disabled: { start: CURRENT_TIME, end: getTime(endOfDay(CURRENT_TIME)) }
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
    <ElementActionComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={editProduct}
      isProcessing={isProcessing}
      disableConfirmOn={isProcessing}
      confirmText="Confirm"
      body={
        <Grid item xs={12}>
          Are you sure you'd like to disable {productName} until end-of-day?
        </Grid>
      }
    />
  );
};

export default ProductDisableUntilEodContainer;