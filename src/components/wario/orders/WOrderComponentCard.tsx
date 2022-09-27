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

export type WOrderComponentCardProps = {
  order: WOrderInstance;
  onCloseCallback: React.MouseEventHandler<HTMLButtonElement>;
} & CardProps;

type ComponentCardMode = 'cancel' | 'reschedule' | null;

export const WOrderComponentCard = ({ order, onCloseCallback, ...other }: WOrderComponentCardProps) => {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<ComponentCardMode>(null);
  const TAX_RATE = useAppSelector(SelectTaxRate);
  const catalogSelectors = useAppSelector(s => CatalogSelectors(s.ws));
  const fulfillment = useAppSelector(s => s.ws.fulfillments![order.fulfillment.selectedService]);
  const serviceTimeInterval = useMemo(() => DateTimeIntervalBuilder(order.fulfillment, fulfillment), [order.fulfillment, fulfillment]);
  //const processedCart = useAppSelector(s=>selectCoreCartWProduct(s, order.cart, serviceTimeInterval.start, order.fulfillment.selectedService));
  const fullGroupedCart = useAppSelector(s => selectFullGroupedCartInfo(s, order.cart, serviceTimeInterval.start, order.fulfillment.selectedService));

  const { getAccessTokenSilently } = useAuth0();
  const orderSliceState = useAppSelector(s => s.orders.requestStatus)

  const confirmOrderClickHandler = async () => {
    const token = await getAccessTokenSilently({ scope: "write:order" });
    dispatch(confirmOrder({ orderId: order.id, additionalMessage: "", token: token }));
  }

  return <Card sx={GetStyleForOrderStatus(order.status)} {...other}>
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
      { mode === null && <WOrderCheckoutCartContainer order={order} hideProductDescriptions /> }
      
    </CardContent>
    <CardActions>
      {order.status !== WOrderStatus.COMPLETED && order.status !== WOrderStatus.CANCELED && <Button disabled={orderSliceState === "PENDING"} onClick={() => setMode('cancel')} size='small'>Cancel</Button>}
      {order.status !== WOrderStatus.COMPLETED && order.status !== WOrderStatus.CANCELED && <Button disabled={orderSliceState === "PENDING"} onClick={() => setMode('reschedule')} size='small'>Reschedule</Button>}
      {order.status === WOrderStatus.OPEN && <Button disabled={orderSliceState === "PENDING"} onClick={confirmOrderClickHandler} size='small'>Confirm!</Button>}
    </CardActions>
  </Card>
}