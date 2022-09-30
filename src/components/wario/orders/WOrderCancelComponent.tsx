import { useMemo, useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";

import { ElementActionComponent, ElementActionComponentProps } from "../menu/element.action.component";
import { Grid, TextField } from "@mui/material";

import { cancelOrder } from "../../../redux/slices/OrdersSlice";
import { WOrderInstance } from "@wcp/wcpshared";

type WOrderCancelComponentProps = { order: WOrderInstance; onCloseCallback: ElementActionComponentProps['onCloseCallback'] };
const WOrderCancelComponent = (props: WOrderCancelComponentProps) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
  const orderSliceState = useAppSelector(s => s.orders.requestStatus)

  const [cancelationReason, setCancelationReason] = useState("");

  const submitToWario: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (orderSliceState !== 'PENDING') {
      const token = await getAccessTokenSilently({ scope: "cancel:order" });
      await dispatch(cancelOrder({ orderId: props.order.id, emailCustomer: true, reason: cancelationReason, token: token }));
      props.onCloseCallback(e);
    }
  }

  return (<ElementActionComponent
      onCloseCallback={props.onCloseCallback}
      onConfirmClick={submitToWario}
      isProcessing={orderSliceState === 'PENDING'}
      disableConfirmOn={orderSliceState === 'PENDING' || cancelationReason.length < 5}
      confirmText={'Process Order Cancelation'}
      body={
        <TextField
          multiline
          fullWidth
          minRows={cancelationReason.split('\n').length + 1}
          label="CUSTOMER FACING (they will read this) cancelation reason"
          type="text"
          value={cancelationReason}
          onChange={(e) => setCancelationReason(e.target.value)}
        />
      }
    />)
};

export default WOrderCancelComponent;
