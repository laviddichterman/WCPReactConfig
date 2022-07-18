import React, { useState } from "react";
import { getTime, endOfDay } from 'date-fns';
import { useAuth0 } from '@auth0/auth0-react';
import Grid from "@mui/material/Grid";
import { ElementActionComponent } from "./element.action.component";
import { HOST_API } from "../../../config";

import {ProductQuickActionProps} from './product.delete.container';

const ProductDisableUntilEodContainer = ({ product, productName, onCloseCallback } : ProductQuickActionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const editProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${HOST_API}/api/v1/menu/product/${product.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            disabled: { start: getTime(new Date()), end: getTime(endOfDay(new Date())) },
            service_disable: product.service_disable,
            price: product.price,
            display_flags: product.display_flags,
            category_ids: product.category_ids,
            modifiers: product.modifiers,
          }),
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