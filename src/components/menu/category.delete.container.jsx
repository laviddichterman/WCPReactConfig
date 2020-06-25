import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import ElementDeleteComponent from "./element.delete.component";
import { useAuth0 } from "../../react-auth0-spa";

const CategoryDeleteContainer = ({ ENDPOINT, category, onCloseCallback }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getTokenSilently } = useAuth0();

  const editCategory = async (e) => {
    e.preventDefault();

    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/category/${category._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        setIsProcessing(false);
        onCloseCallback();
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
        onClick={editCategory}
        disabled={isProcessing}>
        Confirm
      </Button>
      ]}
      name={category.name}
    />
  );
};

export default CategoryDeleteContainer;
