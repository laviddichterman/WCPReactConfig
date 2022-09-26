import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardHeader, CardActions, Button, CardProps, SxProps, CardContent, Avatar } from "@mui/material";
import { red } from "@mui/material/colors";
import { ComputeTipValue, CreditPayment, CURRENCY, DateTimeIntervalBuilder, PaymentMethod, WDateUtils, WOrderInstance, WOrderStatus } from "@wcp/wcpshared";
import { useMemo } from "react";
import { CatalogSelectors, getProductInstanceById, ProductDisplay, WCheckoutCartComponent } from '@wcp/wario-ux-shared';
import { confirmOrder, SocketAuthActions } from "../../../redux/slices/OrdersSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { selectCoreCartWProduct, selectFullGroupedCartInfo } from "../../../redux/store";

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

export type WOrderComponentCardProps = { order: WOrderInstance } & CardProps;

export const WOrderComponentCard = ({ order, ...other }: WOrderComponentCardProps) => {
  const dispatch = useAppDispatch();
  const catalogSelectors = useAppSelector(s=>CatalogSelectors(s.ws));
  const fulfillment = useAppSelector(s => s.ws.fulfillments![order.fulfillment.selectedService]);
  const serviceTimeInterval = useMemo(() => DateTimeIntervalBuilder(order.fulfillment, fulfillment), [order.fulfillment, fulfillment]);
  //const processedCart = useAppSelector(s=>selectCoreCartWProduct(s, order.cart, serviceTimeInterval.start, order.fulfillment.selectedService));
  const fullGroupedCart = useAppSelector(s=>selectFullGroupedCartInfo(s, order.cart, serviceTimeInterval.start, order.fulfillment.selectedService));

  const { getAccessTokenSilently } = useAuth0();
  const orderSliceState = useAppSelector(s => s.wsAuth.requestStatus)
  const cancelOrderClickHandler = async () => {
    dispatch(SocketAuthActions.setOrderForCancel(order))
  }
  const confirmOrderClickHandler = async () => {
    const token = await getAccessTokenSilently({ scope: "write:order" });
    dispatch(confirmOrder({ orderId: order.id, additionalMessage: "", token: token }));
  }
  const rescheduleOrderClickHandler = async () => {
    dispatch(SocketAuthActions.setOrderForReschedule(order))
  }
  return order && (
    <Card sx={GetStyleForOrderStatus(order.status)} {...other}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label={fulfillment.displayName}>
            {fulfillment.displayName[0]}
          </Avatar>
        }
        title={`${order.customerInfo.givenName} ${order.customerInfo.familyName} ${order.id}`}
        subtitle={`${order.fulfillment.selectedDate} at ${WDateUtils.MinutesToPrintTime(order.fulfillment.selectedTime)}`}
      />
      <CardContent>
        <WCheckoutCartComponent payments={order.payments.filter(x=>x.t === PaymentMethod.CreditCard) as CreditPayment[]} balanceAfterCredits={{amount: 0, currency: CURRENCY.USD }} cart={fullGroupedCart} catalogSelectors={catalogSelectors} discountCreditsApplied={[]} giftCreditsApplied={[]} selectedService={order.fulfillment.selectedService} taxRate={0.10125} taxValue={{ currency: "USD", amount: 0 }} tipValue={{ currency: "USD", amount: 0 }} /> 
      </CardContent>
      <CardActions>
        {order.status !== WOrderStatus.COMPLETED && order.status !== WOrderStatus.CANCELED && <Button disabled={orderSliceState === "PENDING"} onClick={cancelOrderClickHandler} size='small'>Cancel</Button>}
        {order.status !== WOrderStatus.COMPLETED && order.status !== WOrderStatus.CANCELED && <Button disabled={orderSliceState === "PENDING"} onClick={rescheduleOrderClickHandler} size='small'>Reschedule</Button>}
        {order.status === WOrderStatus.OPEN && <Button disabled={orderSliceState === "PENDING"} onClick={confirmOrderClickHandler} size='small'>Confirm!</Button>}
      </CardActions>
    </Card>);
}