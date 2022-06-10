import React, {useState} from "react";
import { endOfDay, getTime } from 'date-fns'
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers';

const DatetimeBasedDisableComponent = ({ disabled, setDisabled }) => {
  const [enabled, setEnabled] = useState(!disabled);
  const [isDatetimeBased, setIsDatetimeBased] = useState(
    disabled && disabled.start <= disabled.end
  );
  const [disabledStart, setDisabledStart] = useState(
    disabled && disabled.start && disabled.start !== 1 ? disabled.start : getTime(new Date())
  );
  const [disabledEnd, setDisabledEnd] = useState(
    disabled && disabled.end && disabled.end !== 0
      ? disabled.end
      : getTime(endOfDay(new Date()))
  );

  const toggleEnabled = () => {
    if (enabled) {
      setEnabled(false);
      if (isDatetimeBased) {
        setDisabled({ start: disabledStart, end: disabledEnd });
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
      setDisabled({ start: disabledStart, end: disabledEnd });
    }
  };

  const updateDisabledStart = (start) => {
    setDisabledStart(start);
    setDisabled({ start: getTime(start), end: disabled.end });
  };

  const updateDisabledEnd = (end) => {
    setDisabledEnd(end);
    setDisabled({ start: disabled.start, end: getTime(end) });
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
              inputFormat="MMM dd, y hh:mm a"
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
              inputFormat="MMM dd, y hh:mm a"
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
