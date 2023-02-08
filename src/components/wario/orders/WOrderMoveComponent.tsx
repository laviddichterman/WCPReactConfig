import { useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";

import { ElementActionComponent, ElementActionComponentProps } from "../menu/element.action.component";
import { Grid, TextField } from "@mui/material";

import { moveOrder } from "../../../redux/slices/OrdersSlice";
import { WOrderInstance } from "@wcp/wcpshared";

type WOrderMoveComponentProps = { order: WOrderInstance; onCloseCallback: ElementActionComponentProps['onCloseCallback'] };
const WOrderMoveComponent = (props: WOrderMoveComponentProps) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
  const orderSliceState = useAppSelector(s => s.orders.requestStatus)
  const [destination, setDestination] = useState("");
  const [additionalMessage, setAdditionalMessage] = useState("");

  const submitToWario: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (orderSliceState !== 'PENDING') {
      const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:order" } });
      await dispatch(moveOrder({ orderId: props.order.id, destination, additionalMessage, token: token }));
      props.onCloseCallback && props.onCloseCallback(e);
    }
  }

  return (<ElementActionComponent
      onCloseCallback={props.onCloseCallback}
      onConfirmClick={submitToWario}
      isProcessing={orderSliceState === 'PENDING'}
      disableConfirmOn={orderSliceState === 'PENDING' || destination.length < 2}
      confirmText={'Send Move Ticket'}
      body={
<>
        <Grid item xs={12}>
        <TextField
        fullWidth
        label="Destination"
        type="text"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      </Grid>
      <Grid item xs={12}>
      <TextField
          multiline
          fullWidth
          minRows={additionalMessage.split('\n').length + 1}
          label="Additional message to expo"
          type="text"
          value={additionalMessage}
          onChange={(e) => setAdditionalMessage(e.target.value)}
        />
      </Grid>
      </>
      
      }
    />)
};

export default WOrderMoveComponent;
