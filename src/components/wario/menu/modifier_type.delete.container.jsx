import React, { useState } from "react";

import ElementDeleteComponent from "./element.delete.component";
import { useAuth0 } from '@auth0/auth0-react';

const ModifierTypeDeleteContainer = ({ ENDPOINT, modifier_type, onCloseCallback }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const deleteModifierType = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "delete:catalog"} );
        const response = await fetch(`${ENDPOINT}/api/v1/menu/option/${modifier_type._id}`, {
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
      onCloseCallback={onCloseCallback}
      onConfirmClick={deleteModifierType}
      name={modifier_type.name}
      isProcessing={isProcessing}
    />
  );
};

export default ModifierTypeDeleteContainer;
