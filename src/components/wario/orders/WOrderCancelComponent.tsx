import { useMemo, useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";

import { ElementActionComponent, ElementActionComponentProps } from "../menu/element.action.component";
import { Grid, TextField } from "@mui/material";

import { cancelOrder, SocketAuthActions } from "../../../redux/slices/OrdersSlice";

type WOrderCancelComponentProps = { onCloseCallback: ElementActionComponentProps['onCloseCallback'] };
const WOrderCancelComponent = (props: WOrderCancelComponentProps) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
  const order = useAppSelector(s => s.wsAuth.orderToEdit);
  const orderSliceState = useAppSelector(s => s.wsAuth.requestStatus)

  const [cancelationReason, setCancelationReason] = useState("");

  const submitToWario = async () => {
    if (orderSliceState !== 'PENDING') {
      const token = await getAccessTokenSilently({ scope: "write:order" });
      dispatch(cancelOrder({ orderId: order!.id, emailCustomer: true, reason: cancelationReason, token: token }));
    }
  }

  return order && (
    <ElementActionComponent
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
          label="Customer facing cancelation reason"
          type="text"
          value={cancelationReason}
          onChange={(e) => setCancelationReason(e.target.value)}
        />
      }
    />
  );
};

export default WOrderCancelComponent;
