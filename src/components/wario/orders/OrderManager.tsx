import React, { useState, useMemo, useCallback, useEffect } from "react";
import { add, format, formatISO, parseISO } from "date-fns";
import {
  Card,
  CardHeader,
  Chip,
  Container,
  Grid,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Autocomplete
} from '@mui/material'
import { Done, HighlightOff } from '@mui/icons-material';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { useAuth0 } from '@auth0/auth0-react';
import { GetNextAvailableServiceDate, IWInterval, PostBlockedOffToFulfillmentsRequest, WDateUtils, WOrderStatus } from "@wcp/wcpshared";

import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { HOST_API } from '../../../config';
import { useSnackbar } from "notistack";
import { getWOrderInstances, pollOpenOrders, SocketAuthActions } from "../../../redux/slices/OrdersSlice";
import { WOrderComponentCard } from "./WOrderComponent";

const OrderManagerComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
  const socketAuthState = useAppSelector((s) => s.wsAuth.status);
  const pollOpenOrdersStatus = useAppSelector((s) => s.wsAuth.pollOpenOrdersStatus);
  const orders = useAppSelector(s => getWOrderInstances(s.wsAuth.orders));
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
          dispatch(pollOpenOrders(token));  
      }
    }
    pollForOrders();
    const timer = setInterval(pollForOrders, 10000);
    return () => clearInterval(timer);
  }, [])
  return (
    <Grid container>
      {orders.map(x => (
        <Grid key={x.id}>
          <WOrderComponentCard order={x} />
        </Grid>
      ))}
    </Grid>
  );
}

export default OrderManagerComponent;