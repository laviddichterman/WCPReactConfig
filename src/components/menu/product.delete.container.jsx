import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ElementDeleteComponent from "./element.delete.component";
import { useAuth0 } from "../../react-auth0-spa";

const ProductDeleteContainer = ({ ENDPOINT, product, onCloseCallback }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getTokenSilently } = useAuth0();

  const deleteProduct = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/product/${product._id}`, {
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
          className="btn btn-light"
          onClick={onCloseCallback}
          disabled={isProcessing}>
          Cancel
        </Button>,
        <Button
        className="btn btn-light"
        onClick={deleteProduct}
        disabled={isProcessing}>
        Confirm
      </Button>
      ]}
      name={product.item.display_name}
    />
  );
};

export default ProductDeleteContainer;