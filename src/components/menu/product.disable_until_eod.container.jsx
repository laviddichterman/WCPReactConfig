import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import moment from "moment";
import Grid from "@mui/material/Grid";
import { ElementActionComponent } from "./element.action.component";

const ProductDisableUntilEodContainer = ({ ENDPOINT, product, onCloseCallback }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const editProduct = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        console.log("honk!")
        const response = await fetch(`${ENDPOINT}/api/v1/menu/product/${product._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            display_name: product.item.display_name,
            description: product.item.description,
            shortcode: product.item.shortcode,
            disabled: { start: moment().valueOf(), end: moment().hour(23).minute(59).valueOf() },
            service_disable: product.service_disable,
            ordinal: product.ordinal,
            price: product.item.price,
            revelID: product.item.externalIDs?.revelID,
            squareID: product.item.externalIDs?.squareID,
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
          Are you sure you'd like to disable {product.item.display_name} until end-of-day?
        </Grid>
      }
    />
  );
};

export default ProductDisableUntilEodContainer;