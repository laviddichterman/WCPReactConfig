import { Grid, CardActions, Button, CardContent } from "@mui/material";
import { WOrderInstance, WOrderStatus } from "@wcp/wcpshared";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { ElementActionComponent, ElementActionComponentProps } from "../menu/element.action.component";
import { WOrderCheckoutCartContainer } from "./WOrderCheckoutCartContainer";
import { WOrderServiceInfoTableContainer } from "./WOrderServiceInfoTableContainer";

export type WOrderDisplayComponentProps = {
  order: WOrderInstance;
  callConfirm: (id: string) => void;
  onCloseCallback: ElementActionComponentProps['onCloseCallback'];
};


export const WOrderDisplayComponent = ({ order, callConfirm, onCloseCallback }: WOrderDisplayComponentProps) => {
  const dispatch = useAppDispatch();
  const fulfillment = useAppSelector(s => s.ws.fulfillments![order.fulfillment.selectedService]);
  const orderSliceState = useAppSelector(s => s.orders.requestStatus)

  return <ElementActionComponent
    onCloseCallback={onCloseCallback}
    onConfirmClick={() => callConfirm(order.id)}
    isProcessing={orderSliceState === 'PENDING'}
    disableConfirmOn={order.status !== WOrderStatus.OPEN}
    confirmText={"Confirm!"}
    body={<Grid xs={12}>
      <WOrderServiceInfoTableContainer order={order} />
      <WOrderCheckoutCartContainer order={order} hideProductDescriptions />
    </Grid>
    }
  />
}