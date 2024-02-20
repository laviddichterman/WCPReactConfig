import { Card, CardHeader, CardProps, SxProps, Tab, Avatar, Typography, Box } from "@mui/material";
import { red } from "@mui/material/colors";
import { ComputeServiceTimeDisplayString, DateTimeIntervalBuilder, WDateUtils, WOrderStatus } from "@wcp/wcpshared";
import { useState } from "react";
import { TabList, TabPanel, TabContext } from '@mui/lab';
import { format } from "date-fns";

import { getWOrderInstanceById } from "../../../redux/slices/OrdersSlice";
import { useAppSelector } from "../../../hooks/useRedux";
import { getPrinterGroups } from "../../../redux/slices/PrinterGroupSlice";
import WOrderCancelComponent from "./WOrderCancelComponent";
import { WOrderDisplayComponent } from "./WOrderDisplayComponent";
import WOrderRescheduleComponent from "./WOrderRescheduleComponent";
import WOrderForceSendComponent from "./WOrderForceSendComponent";
import { ElementActionComponentProps } from "../menu/element.action.component";
import WOrderMoveComponent from "./WOrderMoveComponent";
import WOrderRawDataDisplayComponent from "./WOrderRawDataDisplay";
import { localCreateSelector, RootState } from "../../../redux/store";
import { getFulfillmentById } from "@wcp/wario-ux-shared";

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

const selectOrderSubheader = localCreateSelector(
  (s: RootState, oId: string) => getWOrderInstanceById(s.orders.orders, oId).fulfillment,
  (s: RootState, _oId: string) => s.ws.fulfillments,
  (orderFulfillment, fulfillments) => {
    const fulfillmentConfig = getFulfillmentById(fulfillments, orderFulfillment.selectedService);
    const serviceTimeInterval = DateTimeIntervalBuilder(orderFulfillment, fulfillmentConfig.maxDuration);
    return `${fulfillmentConfig.displayName} on ${format(serviceTimeInterval.start, WDateUtils.ServiceDateDisplayFormat)} at ${ComputeServiceTimeDisplayString(fulfillmentConfig.minDuration, orderFulfillment.selectedTime)}`;
  }
)

export const WOrderComponentCard = ({ orderId, onCloseCallback, handleConfirmOrder, ...other }: WOrderComponentCardProps) => {
  const hasExpoPrinter = useAppSelector(s => getPrinterGroups(s.printerGroup.printerGroups).filter(x => x.isExpo).length > 0);
  const orderStatus = useAppSelector(s => getWOrderInstanceById(s.orders.orders, orderId)!.status);
  const orderTitle = useAppSelector(s => {
    const constumerInfo = getWOrderInstanceById(s.orders.orders, orderId)!.customerInfo;
    return `${constumerInfo.givenName} ${constumerInfo.familyName}`;
  });
  const orderSubheader = useAppSelector(s => selectOrderSubheader(s, orderId));
  const [mode, setMode] = useState<ComponentCardMode>('info');
  return <Card sx={GetStyleForOrderStatus(orderStatus)} {...other}>
    <CardHeader
      avatar={
        <Avatar sx={{ bgcolor: red[500] }} aria-label={orderId}>
          {orderSubheader[0]}
        </Avatar>
      }
      title={orderTitle}
      subheader={orderSubheader}
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
          {(orderStatus === WOrderStatus.CONFIRMED || orderStatus === WOrderStatus.COMPLETED || orderStatus === WOrderStatus.PROCESSING) && hasExpoPrinter && <Tab wrapped key={'move'} label={<Typography variant='h6'>Move</Typography>} value={'move'} />}
          <Tab wrapped key={'forceSend'} label={<Typography variant='h6'>Force Send</Typography>} value={'forceSend'} />
          {orderStatus === WOrderStatus.OPEN && <Tab wrapped key={'confirm'} label={<Typography variant='h6'>Confirm</Typography>} value={'confirm'} />}
        </TabList>
      </Box>
      <TabPanel sx={{ p: 0 }} key={'info'} value={'info'}>
        <WOrderDisplayComponent orderId={orderId} onCloseCallback={onCloseCallback} callConfirm={handleConfirmOrder} />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} key={'cancel'} value={'cancel'}>
        <WOrderCancelComponent orderId={orderId} onCloseCallback={onCloseCallback} />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} key={'rawData'} value={'rawData'}>
        <WOrderRawDataDisplayComponent orderId={orderId} onCloseCallback={onCloseCallback} />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} key={'forceSend'} value={'forceSend'}>
        <WOrderForceSendComponent orderId={orderId} onCloseCallback={onCloseCallback} />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} key={'move'} value={'move'}>
        <WOrderMoveComponent orderId={orderId} onCloseCallback={onCloseCallback} />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} key={'reschedule'} value={'reschedule'}>
        <WOrderRescheduleComponent orderId={orderId} onCloseCallback={onCloseCallback} />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} key={'confirm'} value={'confirm'}>
        <WOrderDisplayComponent orderId={orderId} callConfirm={handleConfirmOrder} onCloseCallback={onCloseCallback} />
      </TabPanel>
    </TabContext>
  </Card>
}