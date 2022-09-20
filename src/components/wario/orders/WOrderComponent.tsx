import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardHeader, CardActions, Button, CardProps, SxProps, CardContent } from "@mui/material";
import { WDateUtils, WOrderInstance, WOrderStatus } from "@wcp/wcpshared";
import { useMemo } from "react";
import { cancelOrder, confirmOrder, rescheduleOrder } from "src/redux/slices/OrdersSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";

const GetStyleForOrderStatus = (status: WOrderStatus): SxProps => {
  switch (status) {
    case WOrderStatus.CANCELED:
      return { borderColor: 'red', borderWidth: 2, borderStyle: 'solid' };
    case WOrderStatus.COMPLETED:
      return { borderColor: 'blue', borderWidth: 2, borderStyle: 'solid' };

    case WOrderStatus.CONFIRMED:
      return { borderColor: 'orange', borderWidth: 2, borderStyle: 'solid' };

    case WOrderStatus.OPEN:
      return { borderColor: 'yellow', borderWidth: 2, borderStyle: 'solid' };

    case WOrderStatus.PROCESSING:
      return { borderColor: 'green', borderWidth: 2, borderStyle: 'solid' };
  }
}

export const WOrderComponentCard = ({ order, ...other }: { order: WOrderInstance } & CardProps) => {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const orderSliceState = useAppSelector(s=>s.wsAuth.pollOpenOrdersStatus)
  const fulfillment = useAppSelector(s => s.ws.fulfillments![order.fulfillment.selectedService]);
  const orderTitle = useMemo(() => `${fulfillment.displayName} for ${order.customerInfo.givenName} ${order.customerInfo.familyName} on ${order.fulfillment.selectedDate} at ${WDateUtils.MinutesToPrintTime(order.fulfillment.selectedTime)}`, [order, fulfillment.displayName]);
  const cancelOrderClickHandler = async () => {
    const token = await getAccessTokenSilently({ scope: "write:order" });
    dispatch(cancelOrder({orderId: order.id, emailCustomer: true, reason: "whatever bro", token: token }));
  }
  const confirmOrderClickHandler = async () => {
    const token = await getAccessTokenSilently({ scope: "write:order" });
    dispatch(confirmOrder({orderId: order.id, additionalMessage: "", token: token }));
  }
  const rescheduleOrderClickHandler = async () => {
    const token = await getAccessTokenSilently({ scope: "write:order" });
    //dispatch(rescheduleOrder({orderId: order.id, emailCustomer: true, token: token,  }));
  }
  return order && (
    <Card sx={GetStyleForOrderStatus(order.status)} variant={order.status === WOrderStatus.OPEN ? 'elevation' : 'outlined'} {...other}>
      <CardHeader title={orderTitle}></CardHeader>
      <CardContent>
        
      </CardContent>
      <CardActions>
        {order.status !== WOrderStatus.COMPLETED && <Button disabled={orderSliceState === "PENDING"} onClick={cancelOrderClickHandler} size='small'>Cancel</Button>}
        {order.status !== WOrderStatus.COMPLETED && <Button disabled={orderSliceState === "PENDING"} size='small'>Reschedule</Button>}
        {order.status === WOrderStatus.OPEN && <Button disabled={orderSliceState === "PENDING"} onClick={confirmOrderClickHandler} size='small'>Confirm!</Button>}
      </CardActions>
    </Card>);
}