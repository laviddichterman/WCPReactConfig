import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ElementDeleteComponent from "../element.delete.component";
import { HOST_API } from "../../../../config";
import { CategoryEditProps } from "./category.component";
import { useSnackbar } from "notistack";

const CategoryDeleteContainer = ({ category, onCloseCallback }: CategoryEditProps) => {
  const { enqueueSnackbar } = useSnackbar();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const deleteCategory = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "delete:catalog" });
        const response = await fetch(`${HOST_API}/api/v1/menu/category/${category.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        if (response.status === 200) {
          enqueueSnackbar(`Deleted category: ${category.name}.`);
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to delete category: ${category.name}. Got error ${JSON.stringify(error)}`, { variant: 'error' });
        console.error(error);
        setIsProcessing(false);
      }
    }
  };


  return (
    <ElementDeleteComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={deleteCategory}
      name={category.name}
      isProcessing={isProcessing}
    />
  );
};

export default CategoryDeleteContainer;
