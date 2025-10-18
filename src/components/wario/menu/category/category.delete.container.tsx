import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import ElementDeleteComponent from "../element.delete.component";
import { HOST_API } from "../../../../config";
import { CategoryEditProps } from "./category.component";
import { useSnackbar } from "notistack";
import { Grid } from "@mui/material";
import { ToggleBooleanPropertyComponent } from "../../property-components/ToggleBooleanPropertyComponent";
import { useAppSelector } from "../../../../hooks/useRedux";
import { getCategoryEntryById } from "@wcp/wario-ux-shared";

const CategoryDeleteContainer = ({ categoryId, onCloseCallback }: CategoryEditProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const categoryName = useAppSelector(s=> getCategoryEntryById(s.ws.categories, categoryId)!.category.name);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const [ deleteContainedProducts, setDeleteContainedProducts ] = useState(false);

  const deleteCategory = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ authorizationParams: { scope: "delete:catalog" } });
        const responseDeleteCategory = await fetch(`${HOST_API}/api/v1/menu/category/${categoryId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ delete_contained_products: deleteContainedProducts }),
        });
        if (responseDeleteCategory.status === 200) {
          enqueueSnackbar(`Deleted category: ${categoryName}${deleteContainedProducts ? " and contained products" : ""}.`);
          onCloseCallback();
        }
      } catch (error) {
        enqueueSnackbar(`Unable to delete category: ${categoryName}. Got error ${JSON.stringify(error, null, 2)}`, { variant: 'error' });
        console.error(error);
      }
      setIsProcessing(false);
    }
  };


  return (
    <ElementDeleteComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={deleteCategory}
      name={categoryName}
      isProcessing={isProcessing}
      additionalBody={
        <Grid size={12}>
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
