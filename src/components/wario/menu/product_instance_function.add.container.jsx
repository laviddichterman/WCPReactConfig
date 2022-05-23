import React, { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ProductInstanceFunctionComponent from "./product_instance_function.component";

const ProductInstanceFunctionAddContainer = ({ ENDPOINT, modifier_types, onCloseCallback }) => {
  const [functionName, setFunctionName] = useState("");
  const [expression, setExpression] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addProductInstanceFunction = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:catalog"} );
        const response = await fetch(`${ENDPOINT}/api/v1/query/language/productinstancefunction/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: functionName,
            expression
          }),
        });
        if (response.status === 201) {
          setFunctionName("");
          setExpression({});
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
      confirmText="Add"
      onCloseCallback={onCloseCallback}
      onConfirmClick={addProductInstanceFunction}
      isProcessing={isProcessing}
      modifier_types={modifier_types}
      functionName={functionName}
      setFunctionName={setFunctionName}
      expression={expression}
      setExpression={setExpression}
    />
  );
};

export default ProductInstanceFunctionAddContainer;
