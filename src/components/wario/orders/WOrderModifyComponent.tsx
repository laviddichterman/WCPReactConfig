import { useMemo, useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";

import { WDateUtils, WOrderInstance } from "@wcp/wcpshared";
import { ElementActionComponent, ElementActionComponentProps } from "../menu/element.action.component";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { add, parseISO } from "date-fns";
import { range } from 'lodash';
import { StaticDatePicker } from "@mui/x-date-pickers";
import { rescheduleOrder } from "../../../redux/slices/OrdersSlice";

type WOrderModifyComponentProps = { order: WOrderInstance; onCloseCallback: ElementActionComponentProps['onCloseCallback'] };
const WOrderModifyComponent = (props: WOrderModifyComponentProps) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
  const fulfillments = useAppSelector(s => s.ws.fulfillments!);
  const fulfillmentTimeStep = useMemo(() => fulfillments[props.order.fulfillment.selectedService].timeStep, [fulfillments, props.order]);
  const orderSliceState = useAppSelector(s => s.orders.requestStatus)
  const CURRENT_TIME = useAppSelector(s => s.ws.currentTime);

  const [selectedDate, setSelectedDate] = useState(props.order.fulfillment.selectedDate ?? "");
  const [selectedTime, setSelectedTime] = useState(props.order.fulfillment.selectedTime ?? 1440);

  const submitToWario = async () => {
    if (orderSliceState !== 'PENDING') {
      const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:order" } });
      await dispatch(rescheduleOrder({ token, orderId: props.order.id, selectedDate, selectedTime, emailCustomer: true }));
    }
  }
  return (
    <ElementActionComponent
      onCloseCallback={props.onCloseCallback}
      onConfirmClick={submitToWario}
      isProcessing={orderSliceState === 'PENDING'}
      disableConfirmOn={orderSliceState === 'PENDING'}
      confirmText={'Update'}
      body={
        <>
          <Grid item xs={12} sm={6}>
            <StaticDatePicker
              renderInput={(props) => <TextField {...props} />}
              displayStaticWrapperAs="desktop"
              openTo="day"
              showToolbar={false}
              minDate={new Date(CURRENT_TIME)}
              maxDate={add(CURRENT_TIME, { days: 60 })}
              value={parseISO(selectedDate)}
              onChange={(date) => setSelectedDate(WDateUtils.formatISODate(date!))}
              inputFormat={WDateUtils.ServiceDateDisplayFormat}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              sx={{ m: 'auto', maxWidth: 200 }}
              disableClearable
              className="col"
              options={range(fulfillmentTimeStep, 1440, fulfillmentTimeStep)}
              isOptionEqualToValue={(o, v) => o === v}
              getOptionLabel={x => x !== null ? WDateUtils.MinutesToPrintTime(x) : ""}
              value={selectedTime}
              onChange={(_, v) => setSelectedTime(v)}
              disabled={selectedDate === null}
              renderInput={(params) => <TextField {...params} label={"Time"}
              />}
            />
          </Grid>

        </>
      }
    />
  );
};

export default WOrderModifyComponent;
