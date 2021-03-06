import React, {useState} from "react";

import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";

const DatetimeBasedDisableComponent = ({ disabled, setDisabled }) => {
  const [enabled, setEnabled] = useState(disabled ? false : true);
  const [isDatetimeBased, setIsDatetimeBased] = useState(
    disabled && disabled.start <= disabled.end
  );
  const [disabledStart, setDisabledStart] = useState(
    disabled && disabled.start && disabled.start !== 1 ? moment(disabled.start) : moment()
  );
  const [disabledEnd, setDisabledEnd] = useState(
    disabled && disabled.end && disabled.end !== 0
      ? moment(disabled.end)
      : moment().hour(23).minute(59)
  );

  const toggleEnabled = () => {
    if (enabled) {
      setEnabled(false);
      setDisabled(isDatetimeBased ? { start: disabledStart.valueOf(), end: disabledEnd.valueOf() } : { start: 1, end: 0 });
    }
    else {
      setEnabled(true);
      setDisabled(null);
    }
  }
  const toggleIsDatetimeBased = () => {
    if (isDatetimeBased) {
      setIsDatetimeBased(false);
      setDisabled(enabled ? null : { start: 1, end: 0 });
    } else {
      setIsDatetimeBased(true);
      setDisabled({ start: disabledStart.valueOf(), end: disabledEnd.valueOf() });
    }
  };

  const updateDisabledStart = (start) => {
    setDisabledStart(start);
    setDisabled({ start: start.valueOf(), end: disabled.end });
  };

  const updateDisabledEnd = (end) => {
    setDisabledEnd(end);
    setDisabled({ start: disabled.start, end: end.valueOf() });
  };

  return (
    <Grid container>
      <Grid item xs={6}>
        <FormControlLabel
          control={
            <Switch
              checked={enabled}
              onChange={toggleEnabled}
              name="Enabled"
            />
          }
          label="Enabled"
        />
      </Grid>
      {enabled ? (
        ""
      ) : (
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={!isDatetimeBased}
                onChange={toggleIsDatetimeBased}
                name="Blanket Disable"
              />
            }
            label="Blanket Disable"
          />
        </Grid>
      )}
      {(!enabled && isDatetimeBased) ? (
        <>
          <Grid item xs={6}>
          <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
              <DateTimePicker
                inputVariant="standard"
                autoOk
                placeholder={"Disabled Start"}
                label={"Disabled Start"}
                disablePast
                value={disabledStart}
                onChange={(date) => updateDisabledStart(date)}
                format="MMMM DD, Y hh:mm A"
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={6}>
          <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
              <DateTimePicker
                inputVariant="standard"
                autoOk
                placeholder={"Disabled End"}
                label={"Disabled End"}
                disablePast
                minDate={disabledStart}
                value={disabledEnd}
                onChange={(date) => updateDisabledEnd(date)}
                format="MMMM DD, Y hh:mm A"
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </>
      ) : (
        ""
      )}
    </Grid>
  );
};

export default DatetimeBasedDisableComponent;
