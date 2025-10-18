import { useAuth0 } from '@auth0/auth0-react';
import { Grid } from "@mui/material";
import { getProductEntryById } from "@wcp/wario-ux-shared";
import { IProduct } from "@wcp/wcpshared";
import { endOfDay, getTime } from 'date-fns';
import { useSnackbar } from "notistack";
import { useState } from "react";
import { HOST_API } from "../../../../config";
import { useAppSelector } from "../../../../hooks/useRedux";
import { selectBaseProductName } from "../../../../redux/store";
import { ElementActionComponent } from "../element.action.component";
import { ProductQuickActionProps } from './product.delete.container';

const ProductDisableUntilEodContainer = ({ product_id, onCloseCallback }: ProductQuickActionProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const productName = useAppSelector(s => selectBaseProductName(s, product_id));
  const product = useAppSelector(s => getProductEntryById(s.ws.products, product_id)!.product);
  const [isProcessing, setIsProcessing] = useState(false);
  const CURRENT_TIME = useAppSelector(s => s.ws.currentTime);
  const { getAccessTokenSilently } = useAuth0();
  const editProduct = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:catalog" } });
        const body: IProduct = {
          ...product,
          disabled: { start: CURRENT_TIME, end: getTime(endOfDay(CURRENT_TIME)) }
        };
        const response = await fetch(`${HOST_API}/api/v1/menu/product/${product_id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.status === 200) {
          enqueueSnackbar(`Disabled ${productName} until EOD.`)
          onCloseCallback();
        }
        setIsProcessing(false);
      } catch (error) {
        enqueueSnackbar(`Unable to update ${productName}. Got error: ${JSON.stringify(error, null, 2)}.`, { variant: "error" });
        console.error(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <ElementActionComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={editProduct}
      isProcessing={isProcessing}
      disableConfirmOn={isProcessing}
      confirmText="Confirm"
      body={
        <Grid size={12}>
          Are you sure you'd like to disable {productName} until end-of-day?
        </Grid>
      }
    />
  );
};

export default ProductDisableUntilEodContainer;