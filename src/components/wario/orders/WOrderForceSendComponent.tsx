import { useMemo, useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";

import { ElementActionComponent, ElementActionComponentProps } from "../menu/element.action.component";
import { Grid, TextField } from "@mui/material";

import { forceSendOrder } from "../../../redux/slices/OrdersSlice";
import { WOrderInstance } from "@wcp/wcpshared";

type WOrderForceSendComponentProps = { order: WOrderInstance; onCloseCallback: ElementActionComponentProps['onCloseCallback'] };
const WOrderForceSendComponent = (props: WOrderForceSendComponentProps) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
  const orderSliceState = useAppSelector(s => s.orders.requestStatus)

  const submitToWario: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (orderSliceState !== 'PENDING') {
      const token = await getAccessTokenSilently({ scope: "cancel:order" });
      await dispatch(forceSendOrder({ orderId: props.order.id, token: token }));
      props.onCloseCallback(e);
    }
  }

  return (<ElementActionComponent
      onCloseCallback={props.onCloseCallback}
      onConfirmClick={submitToWario}
      isProcessing={orderSliceState === 'PENDING'}
      disableConfirmOn={orderSliceState === 'PENDING'}
      confirmText={'Force Send Order (BE CAREFUL WITH THIS)'}
      body={<></>
      }
    />)
};

export default WOrderForceSendComponent;
