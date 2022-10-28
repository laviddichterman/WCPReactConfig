import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardHeader, CardProps, SxProps, Tab, CardContent, Avatar, Typography, Box } from "@mui/material";
import { red } from "@mui/material/colors";
import { ComputeServiceTimeDisplayString, DateTimeIntervalBuilder, WDateUtils, WOrderStatus } from "@wcp/wcpshared";
import { useMemo, useState } from "react";
import { TabList, TabPanel, TabContext } from '@mui/lab'

import { getWOrderInstanceById } from "../../../redux/slices/OrdersSlice";
import { useAppSelector } from "../../../hooks/useRedux";
import { getPrinterGroups } from "../../../redux/slices/PrinterGroupSlice";
import { WOrderCheckoutCartContainer } from "./WOrderCheckoutCartContainer";
import WOrderCancelComponent from "./WOrderCancelComponent";
import { WOrderDisplayComponent } from "./WOrderDisplayComponent";
import WOrderModifyComponent from "./WOrderModifyComponent";
import WOrderForceSendComponent from "./WOrderForceSendComponent";
import { format } from "date-fns";
import { ElementActionComponentProps } from "../menu/element.action.component";
import WOrderMoveComponent from "./WOrderMoveComponent";

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
  orderId: string;
  onCloseCallback: ElementActionComponentProps['onCloseCallback'];
  handleConfirmOrder: (id: string) => void;
} & CardProps;

type ComponentCardMode = 'info' | 'reschedule' | 'cancel' | 'rawData' | 'forceSend';

export const WOrderComponentCard = ({ orderId, onCloseCallback, handleConfirmOrder, ...other }: WOrderComponentCardProps) => {
  const printerGroups = useAppSelector(s => getPrinterGroups(s.printerGroup.printerGroups));
  const hasExpoPrinter = useMemo(() => Object.values(printerGroups).filter(x=>x.isExpo).length > 0, [printerGroups]);
  const order = useAppSelector(s => getWOrderInstanceById(s.orders.orders, orderId))!;
  const [mode, setMode] = useState<ComponentCardMode>('info');
  const fulfillmentConfig = useAppSelector(s => s.ws.fulfillments![order.fulfillment.selectedService]);
  const serviceTimeInterval = useMemo(() => DateTimeIntervalBuilder(order.fulfillment, fulfillmentConfig), [order.fulfillment, fulfillmentConfig]);
  const { getAccessTokenSilently } = useAuth0();
  //const orderSliceState = useAppSelector(s => s.orders.requestStatus)
  return <Card sx={GetStyleForOrderStatus(order.status)} {...other}>
    <CardHeader
      avatar={
        <Avatar sx={{ bgcolor: red[500] }} aria-label={fulfillmentConfig.displayName}>
          {fulfillmentConfig.displayName[0]}
        </Avatar>
      }
      title={`${order.customerInfo.givenName} ${order.customerInfo.familyName}`}
      subheader={`${fulfillmentConfig.displayName} on ${format(serviceTimeInterval.start, WDateUtils.ServiceDateDisplayFormat)} at ${ComputeServiceTimeDisplayString(fulfillmentConfig.minDuration, order.fulfillment.selectedTime)}`}
    />
    <TabContext value={mode}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList
          TabIndicatorProps={{ hidden: true }}
          scrollButtons={false}
          centered
          onChange={(_, v) => setMode(v)}
          aria-label={`order tab navigation`}
        >
          <Tab wrapped key={'info'} label={<Typography variant='h6'>Information</Typography>} value={'info'} />
          <Tab wrapped key={'reschedule'} label={<Typography variant='h6'>Reschedule</Typography>} value={'reschedule'} />
          <Tab wrapped key={'cancel'} label={<Typography variant='h6'>Cancel</Typography>} value={'cancel'} />
          <Tab wrapped key={'rawData'} label={<Typography variant='h6'>Raw Data</Typography>} value={'rawData'} />
          { (order.status === WOrderStatus.CONFIRMED || order.status === WOrderStatus.COMPLETED || order.status === WOrderStatus.PROCESSING ) && hasExpoPrinter && <Tab wrapped key={'move'} label={<Typography variant='h6'>Move</Typography>} value={'move'} /> }
          <Tab wrapped key={'forceSend'} label={<Typography variant='h6'>Force Send</Typography>} value={'forceSend'} />
          { order.status === WOrderStatus.OPEN && <Tab wrapped key={'confirm'} label={<Typography variant='h6'>Confirm</Typography>} value={'confirm'} /> }
        </TabList>
      </Box>
      <TabPanel sx={{ p: 0 }} key={'info'} value={'info'}>
        <WOrderDisplayComponent order={order} onCloseCallback={onCloseCallback} callConfirm={handleConfirmOrder} />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} key={'cancel'} value={'cancel'}>
        <WOrderCancelComponent order={order} onCloseCallback={onCloseCallback} />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} key={'rawData'} value={'rawData'}>
        <CardContent>
          {JSON.stringify(order, null, 2)}
        </CardContent>
      </TabPanel>
      <TabPanel sx={{ p: 0 }} key={'forceSend'} value={'forceSend'}>
      <WOrderForceSendComponent order={order} onCloseCallback={onCloseCallback} />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} key={'move'} value={'move'}>
        <WOrderMoveComponent order={order} onCloseCallback={onCloseCallback} />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} key={'reschedule'} value={'reschedule'}>
        <WOrderModifyComponent order={order} onCloseCallback={onCloseCallback} />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} key={'confirm'} value={'confirm'}>
        <WOrderDisplayComponent order={order} callConfirm={handleConfirmOrder} onCloseCallback={onCloseCallback} />
      </TabPanel>
    </TabContext>
  </Card>
}