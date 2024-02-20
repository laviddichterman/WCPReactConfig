import { useState, useEffect } from "react";

import { useAuth0 } from '@auth0/auth0-react';

import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { pollOpenOrders, unlockOrders } from "../../../redux/slices/OrdersSlice";
import { Button, Card, Tooltip, Typography, Box } from "@mui/material";
import { WDateUtils, WOrderInstance } from "@wcp/wcpshared";
import TableWrapperComponent from "../table_wrapper.component";
import { CheckCircleOutline } from "@mui/icons-material";
import { GridActionsCellItem, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid-premium";
import { useGridApiRef } from "@mui/x-data-grid-premium";
import { selectEventTitleStringForOrder, selectOrdersNeedingAttention } from "../../../redux/store";
import { WOrderComponentCard } from "./WOrderComponentCard";
import { FullScreenPulsingContainer } from "@wcp/wario-ux-shared";

export interface OrderManagerComponentProps { 
  handleConfirmOrder: (id: string) => void;
}

interface RowType { row: WOrderInstance };

const EventTitle = (params: GridRenderCellParams<RowType>) => {
  const selectEventTitleString = useAppSelector(s=> (order: WOrderInstance) => selectEventTitleStringForOrder(s, params.row.row));
  return <>{selectEventTitleString}</>;
}

const OrderManagerComponent = ({ handleConfirmOrder } : OrderManagerComponentProps) => {
  const apiRef = useGridApiRef();
  const currentTime = useAppSelector(s=>s.ws.currentTime);
  const orderSliceState = useAppSelector(s => s.orders.requestStatus)
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();

  //const socketAuthState = useAppSelector((s) => s.orders.status);
  const pollOpenOrdersStatus = useAppSelector((s) => s.orders.pollingStatus);
  const orders = useAppSelector(selectOrdersNeedingAttention);
  const [hasNewOrder, setHasNewOrder] = useState(orders.length > 0);
  const [suppressedNewOrderNoticeForOrder, setSuppressedNewOrderNotice] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (orders.filter(x=>!Object.hasOwn(suppressedNewOrderNoticeForOrder, x.id)).length > 0) {
      setHasNewOrder(true);
    }
    else {
      setHasNewOrder(false);
    }
  }, [orders]);
  const suppressNotice = () => {
    setSuppressedNewOrderNotice(orders.reduce((acc, order) => ({...acc, [order.id]: true }), suppressedNewOrderNoticeForOrder));
    setHasNewOrder(false);
  }
  
  useEffect(() => {
    const pollForOrders = async () => {
      if (pollOpenOrdersStatus !== 'PENDING') {
        const token = await getAccessTokenSilently({ authorizationParams: { scope: "read:order" } });
        await dispatch(pollOpenOrders({ token, date: WDateUtils.formatISODate(currentTime) }));
      }
    }
    pollForOrders();
    const timer = setInterval(pollForOrders, 30000);
    return () => clearInterval(timer);
  }, [currentTime])

  const callUnlockOrders = async () => {
    const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:order" } });
    dispatch(unlockOrders(token));
  }

  if (hasNewOrder) {
    return <Box onClick={() => suppressNotice()}><FullScreenPulsingContainer children={<Typography variant='h3'>{orders.length} new order{orders.length > 1 ? 's' : ""}</Typography>} /></Box>;
  }
  return (
    <Card>
      <Button onClick={() => callUnlockOrders()} >UNLOCK</Button>
      <TableWrapperComponent
        title="Orders Needing Attention"
        apiRef={apiRef}
        disableRowSelectionOnClick
        enableSearch={true}
        columns={[
          { headerName: "Date", field: "date", valueGetter: (v: { row: WOrderInstance }) => v.row.fulfillment.selectedDate, flex: 1 },
          { headerName: "Time", field: "time", valueGetter: (v: { row: WOrderInstance }) => WDateUtils.MinutesToPrintTime(v.row.fulfillment.selectedTime), flex: 1},
          { headerName: "ShortName", field: "ordinal", renderCell: (params) => <EventTitle {...params} />, flex: 5 },
          {
            headerName: "Confirm",
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams<WOrderInstance>) => [
              <GridActionsCellItem
                icon={<Tooltip title="Confirm Order"><CheckCircleOutline /></Tooltip>}
                label="Confirm Order"
                disabled={orderSliceState === 'PENDING'}
                onClick={() => handleConfirmOrder(params.row.id)}
                key={`CONFIRM${params.row.id}`} />
            ]
          },
        ]}
        onRowClick={(params) => apiRef.current.toggleDetailPanel(params.id)}
        getDetailPanelContent={(params) => <WOrderComponentCard orderId={params.row.id} handleConfirmOrder={handleConfirmOrder} onCloseCallback={null} />}
        rows={orders}
        rowThreshold={0}
      />
    </Card>


  );
}

export default OrderManagerComponent;