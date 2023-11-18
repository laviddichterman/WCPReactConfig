import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ElementDeleteComponent from "../element.delete.component";
import { HOST_API } from "../../../../config";
import { CategoryEditProps } from "./category.component";
import { useSnackbar } from "notistack";
import { Grid } from "@mui/material";
import { ToggleBooleanPropertyComponent } from "../../property-components/ToggleBooleanPropertyComponent";

const CategoryDeleteContainer = ({ category, onCloseCallback }: CategoryEditProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const [ deleteContainedProducts, setDeleteContainedProducts ] = useState(false);

  const deleteCategory = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ authorizationParams: { scope: "delete:catalog" } });
        const responseDeleteCategory = await fetch(`${HOST_API}/api/v1/menu/category/${category.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ delete_contained_products: deleteContainedProducts }),
        });
        if (responseDeleteCategory.status === 200) {
          enqueueSnackbar(`Deleted category: ${category.name}${deleteContainedProducts ? " and contained products" : ""}.`);
          onCloseCallback();
        }
      } catch (error) {
        enqueueSnackbar(`Unable to delete category: ${category.name}. Got error ${JSON.stringify(error, null, 2)}`, { variant: 'error' });
        console.error(error);
      }
      setIsProcessing(false);
    }
  };


  return (
    <ElementDeleteComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={deleteCategory}
      name={category.name}
      isProcessing={isProcessing}
      additionalBody={
        <Grid item xs={12}>
          <ToggleBooleanPropertyComponent
            disabled={isProcessing}
            label="Delete Contained Products"
            setValue={setDeleteContainedProducts}
            value={deleteContainedProducts} />
        </Grid>
      }
    />
  );
};

export default CategoryDeleteContainer;
