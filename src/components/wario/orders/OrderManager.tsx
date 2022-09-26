import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useAuth0 } from '@auth0/auth0-react';

import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { useSnackbar } from "notistack";
import { getWOrderInstances, pollOpenOrders, SocketAuthActions } from "../../../redux/slices/OrdersSlice";
import { WOrderComponentCard } from "./WOrderComponent";
import { DialogContainer } from "@wcp/wario-ux-shared";
import WOrderModifyComponent from "./WOrderModifyComponent";
import WOrderCancelComponent from "./WOrderCancelComponent";
import { Grid } from "@mui/material";

const OrderManagerComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
  const socketAuthState = useAppSelector((s) => s.wsAuth.status);
  const pollOpenOrdersStatus = useAppSelector((s) => s.wsAuth.requestStatus);
  const orders = useAppSelector(s => getWOrderInstances(s.wsAuth.orders));
  const activeDialog = useAppSelector(s=>s.wsAuth.activeDialog);
  const orderToEdit = useAppSelector(s=>s.wsAuth.orderToEdit);
  //const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = await getAccessTokenSilently({ scope: "read:order" });
      if (token && socketAuthState === 'NONE') {
        dispatch(SocketAuthActions.startConnection(token));
      }
    }
    init();
  }, [socketAuthState, getAccessTokenSilently, dispatch]);
  useEffect(() => {
    const pollForOrders = async () => {
      if (pollOpenOrdersStatus !== 'PENDING') {
        const token = await getAccessTokenSilently({ scope: "write:catalog" });
        await dispatch(pollOpenOrders(token));
      }
    }
    pollForOrders();
    const timer = setInterval(pollForOrders, 10000);
    return () => clearInterval(timer);
  }, [])
  return (<>
    <DialogContainer
      title={"Edit Order"}
      onClose={() => dispatch(SocketAuthActions.closeDialog())}
      open={activeDialog === 'RESCHEDULE' && orderToEdit !== null}
      innerComponent={ orderToEdit !== null && 
        <WOrderModifyComponent
          onCloseCallback={() => dispatch(SocketAuthActions.closeDialog())}
        />
      }
    />
        <DialogContainer
      title={"Cancel Order"}
      onClose={() => dispatch(SocketAuthActions.closeDialog())}
      open={activeDialog === 'CANCEL' && orderToEdit !== null }
      innerComponent={ orderToEdit !== null && 
        <WOrderCancelComponent
          onCloseCallback={() => dispatch(SocketAuthActions.closeDialog())}
        />
      }
    />

    <Grid container>
      {orders.map(x => (
        <Grid key={x.id}>
          <WOrderComponentCard order={x} />
        </Grid>
      ))}
    </Grid>
  </>
  );
}

export default OrderManagerComponent;