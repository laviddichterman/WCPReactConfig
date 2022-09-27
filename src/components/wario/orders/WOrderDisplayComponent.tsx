import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardHeader, CardActions, Button, CardProps, SxProps, CardContent, Avatar } from "@mui/material";
import { red } from "@mui/material/colors";
import { DateTimeIntervalBuilder, WDateUtils, WOrderInstance, WOrderStatus } from "@wcp/wcpshared";
import { useMemo, useState } from "react";
import { CatalogSelectors, SelectTaxRate, WCheckoutCartComponent } from '@wcp/wario-ux-shared';
import { confirmOrder, OrdersActions } from "../../../redux/slices/OrdersSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { selectFullGroupedCartInfo } from "../../../redux/store";
import { WOrderCheckoutCartContainer } from "./WOrderCheckoutCartContainer";
import WOrderCancelComponent from "./WOrderCancelComponent";

export type WOrderDisplayComponentProps = {
  order: WOrderInstance;
  setCancel: VoidFunction;
  setReschedule: VoidFunction;
  callConfirm: (id: string) => void;
};


export const WOrderDisplayComponent = ({ order, setCancel, setReschedule, callConfirm }: WOrderDisplayComponentProps) => {
  const dispatch = useAppDispatch();
  const fulfillment = useAppSelector(s => s.ws.fulfillments![order.fulfillment.selectedService]);
  const serviceTimeInterval = useMemo(() => DateTimeIntervalBuilder(order.fulfillment, fulfillment), [order.fulfillment, fulfillment]);
  const orderSliceState = useAppSelector(s => s.orders.requestStatus)
  
  return <>
    <CardContent>
      <WOrderCheckoutCartContainer order={order} hideProductDescriptions />
    </CardContent>
    <CardActions>
      {order.status !== WOrderStatus.COMPLETED && order.status !== WOrderStatus.CANCELED && <Button disabled={orderSliceState === "PENDING"} onClick={setCancel} size='small'>Cancel</Button>}
      {order.status !== WOrderStatus.COMPLETED && order.status !== WOrderStatus.CANCELED && <Button disabled={orderSliceState === "PENDING"} onClick={setReschedule} size='small'>Reschedule</Button>}
      {order.status === WOrderStatus.OPEN && <Button disabled={orderSliceState === "PENDING"} onClick={() => callConfirm(order.id)} size='small'>Confirm!</Button>}
    </CardActions>
  </>
}