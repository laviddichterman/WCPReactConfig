import React, { useState } from "react";

import ProductInstanceFunctionComponent from "./product_instance_function.component";
import { useAuth0 } from '@auth0/auth0-react';

const ProductInstanceFunctionEditContainer = ({ ENDPOINT, modifier_types, product_instance_function, onCloseCallback }) => {
  const [functionName, setFunctionName] = useState(product_instance_function.name);
  const [expression, setExpression] = useState(product_instance_function.expression);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const editProductInstanceFunction = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${ENDPOINT}/api/v1/query/language/productinstancefunction/${product_instance_function._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: functionName,
            expression: expression
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
      modifier_types={modifier_types}
      functionName={functionName}
      setFunctionName={setFunctionName}
      expression={expression}
      setExpression={setExpression}
    />
  );
};

export default ProductInstanceFunctionEditContainer;
