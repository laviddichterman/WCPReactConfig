import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ProductInstanceFunctionComponent from "./product_instance_function.component";
import { HOST_API } from "../../../config";

import { ProductInstanceFunctionQuickActionProps } from './product_instance_function.delete.container';

const ProductInstanceFunctionEditContainer = ({ product_instance_function, onCloseCallback } : ProductInstanceFunctionQuickActionProps) => {
  const [functionName, setFunctionName] = useState(product_instance_function.name);
  const [expression, setExpression] = useState(product_instance_function.expression);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const editProductInstanceFunction = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${HOST_API}/api/v1/query/language/productinstancefunction/${product_instance_function.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: functionName,
            expression
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
    <ProductInstanceFunctionComponent 
      confirmText="Save"
      onCloseCallback={onCloseCallback}
      onConfirmClick={editProductInstanceFunction}
      isProcessing={isProcessing}
      functionName={functionName}
      setFunctionName={setFunctionName}
      expression={expression}
      setExpression={setExpression}
    />
  );
};

export default ProductInstanceFunctionEditContainer;
