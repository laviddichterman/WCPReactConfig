import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ElementDeleteComponent from "./element.delete.component";
import { useAuth0 } from "../../react-auth0-spa";

const ModifierTypeDeleteContainer = ({ ENDPOINT, modifier_type, onCloseCallback }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getTokenSilently } = useAuth0();

  const deleteModifierType = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/option/${modifier_type._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        if (response.status === 201) {
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
        onClick={deleteModifierType}
        disabled={isProcessing}>
        Confirm
      </Button>
      ]}
      name={modifier_type.name}
    />
  );
};

export default ModifierTypeDeleteContainer;
