import React, {useState} from "react";

import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from "moment";

const DatetimeBasedDisableComponent = ({ disabled, setDisabled }) => {
  const [enabled, setEnabled] = useState(!disabled);
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
      if (isDatetimeBased) {
        setDisabled({ start: disabledStart.valueOf(), end: disabledEnd.valueOf() });
      }
      else {
        setDisabled({ start: 1, end: 0 });
      }
      
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
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              fullWidth
              placeholder={"Disabled Start"}
              label={"Disabled Start"}
              disablePast
              value={disabledStart}
              onChange={(date) => updateDisabledStart(date)}
              inputFormat="MMMM DD, Y hh:mm A"
              disableMaskedInput
            />
          </Grid>
          <Grid item xs={6}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              fullWidth
              placeholder={"Disabled End"}
              label={"Disabled End"}
              disablePast
              minDateTime={disabledStart}
              value={disabledEnd}
              onChange={(date) => updateDisabledEnd(date)}
              inputFormat="MMMM DD, Y hh:mm A"
              disableMaskedInput
            />
          </Grid>
        </>
      ) : (
        ""
      )}
    </Grid>
  );
};

export default DatetimeBasedDisableComponent;
