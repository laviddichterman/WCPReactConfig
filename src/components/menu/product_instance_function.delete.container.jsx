import React, { useState } from "react";

import Button from "@mui/material/Button";
import ElementDeleteComponent from "./element.delete.component";
import { useAuth0 } from '@auth0/auth0-react';


const ProductInstanceFunctionDeleteContainer = ({ ENDPOINT, product_instance_function, onCloseCallback }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const deletePIF = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "delete:catalog"} );
        const response = await fetch(`${ENDPOINT}/api/v1/query/language/productinstancefunction/${product_instance_function._id}`, {
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
      actions={[
        <Button
          onClick={onCloseCallback}
          disabled={isProcessing}>
          Cancel
        </Button>,
        <Button
        onClick={deletePIF}
        disabled={isProcessing}>
        Confirm
      </Button>
      ]}
      name={product_instance_function.name}
    />
  );
};

export default ProductInstanceFunctionDeleteContainer;
