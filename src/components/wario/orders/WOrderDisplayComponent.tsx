import { CardActions, Button, CardContent } from "@mui/material";
import { WOrderInstance, WOrderStatus } from "@wcp/wcpshared";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { WOrderCheckoutCartContainer } from "./WOrderCheckoutCartContainer";
import { WOrderServiceInfoTableContainer } from "./WOrderServiceInfoTableContainer";

export type WOrderDisplayComponentProps = {
  order: WOrderInstance;
  callConfirm: (id: string) => void;
};


export const WOrderDisplayComponent = ({ order, callConfirm }: WOrderDisplayComponentProps) => {
  const dispatch = useAppDispatch();
  const fulfillment = useAppSelector(s => s.ws.fulfillments![order.fulfillment.selectedService]);
  const orderSliceState = useAppSelector(s => s.orders.requestStatus)
  
  return <>
    <CardContent>
      <WOrderServiceInfoTableContainer order={order} />
      <WOrderCheckoutCartContainer order={order} hideProductDescriptions />
    </CardContent>
    <CardActions>
      {order.status === WOrderStatus.OPEN && <Button disabled={orderSliceState === "PENDING"} onClick={() => callConfirm(order.id)} size='small'>Confirm!</Button>}
    </CardActions>
  </>
}