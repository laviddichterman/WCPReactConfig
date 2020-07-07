import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ElementDeleteComponent from "./element.delete.component";
import { useAuth0 } from "../../react-auth0-spa";

const ModifierOptionDeleteContainer = ({ ENDPOINT, modifier_option, onCloseCallback }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getTokenSilently } = useAuth0();

  const deleteModifierOption = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/option/${modifier_option.option_type_id}/${modifier_option._id}`, {
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
        onClick={deleteModifierOption}
        disabled={isProcessing}>
        Confirm
      </Button>
      ]}
      name={modifier_option.catalog_item.display_name}
    />
  );
};

export default ModifierOptionDeleteContainer;
