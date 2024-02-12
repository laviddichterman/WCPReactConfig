import { useMemo, useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";

import { WDateUtils } from "@wcp/wcpshared";
import { ElementActionComponent, ElementActionComponentProps } from "../menu/element.action.component";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { add, parseISO } from "date-fns";
import { range } from 'lodash';
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { getWOrderInstanceById, rescheduleOrder } from "../../../redux/slices/OrdersSlice";
import { SelectDateFnsAdapter } from "@wcp/wario-ux-shared";

type WOrderRescheduleComponentProps = { orderId: string; onCloseCallback: ElementActionComponentProps['onCloseCallback'] };
const WOrderRescheduleComponent = (props: WOrderRescheduleComponentProps) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
  const order = useAppSelector(s => getWOrderInstanceById(s.orders.orders, props.orderId))!;
  const fulfillments = useAppSelector(s => s.ws.fulfillments!);
  const fulfillmentTimeStep = useMemo(() => fulfillments[order.fulfillment.selectedService].timeStep, [fulfillments, order]);
  const orderSliceState = useAppSelector(s => s.orders.requestStatus)
  const CURRENT_TIME = useAppSelector(s => s.ws.currentTime);
  const DateAdapter = useAppSelector(s => SelectDateFnsAdapter(s));

  const [selectedDate, setSelectedDate] = useState(order.fulfillment.selectedDate ?? "");
  const [selectedTime, setSelectedTime] = useState(order.fulfillment.selectedTime ?? 1440);

  const submitToWario = async () => {
    if (orderSliceState !== 'PENDING') {
      const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:order" } });
      await dispatch(rescheduleOrder({ token, orderId: order.id, selectedDate, selectedTime, emailCustomer: true }));
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
            <LocalizationProvider dateAdapter={DateAdapter}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                openTo="day"
                minDate={new Date(CURRENT_TIME)}
                maxDate={add(CURRENT_TIME, { days: 60 })}
                value={parseISO(selectedDate)}
                onChange={(date) => setSelectedDate(WDateUtils.formatISODate(date!))}
                slotProps={{
                  toolbar: {
                    hidden: true,
                  },
                }} />
            </LocalizationProvider>
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

export default WOrderRescheduleComponent;
