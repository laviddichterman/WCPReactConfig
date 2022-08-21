import { Dispatch, SetStateAction, useState } from "react";
import { endOfDay, getTime } from 'date-fns'
import { Grid, FormControlLabel, Switch, TextField } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers';
import { IWInterval } from "@wcp/wcpshared";
import { useAppSelector } from "../../hooks/useRedux";

export interface DatetimeBasedDisableComponentProps {
  disabled: IWInterval | null;
  setDisabled: Dispatch<SetStateAction<IWInterval | null>>;
}
const DatetimeBasedDisableComponent = ({ disabled, setDisabled }: DatetimeBasedDisableComponentProps) => {
  const CURRENT_TIME = useAppSelector(s=>s.metrics.currentTime);

  const [enabled, setEnabled] = useState(disabled === null);
  const [isDatetimeBased, setIsDatetimeBased] = useState<boolean>(
    disabled !== null && disabled.start <= disabled.end
  );
  const [disabledStart, setDisabledStart] = useState(
    disabled !== null && disabled.start && disabled.start !== 1 ? disabled.start : getTime(CURRENT_TIME)
  );
  const [disabledEnd, setDisabledEnd] = useState(
    disabled !== null && disabled.end && disabled.end !== 0
      ? disabled.end
      : getTime(endOfDay(CURRENT_TIME))
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

  // TODO: BEFORE COMMITTING THIS, CHECK THAT THE "EMPTY" DATES returned by the datetimepicker make sense.
  const updateDisabledStart = (start: number) => {
    setDisabledStart(start);
    setDisabled({ start: getTime(start), end: disabledEnd });
  };

  const updateDisabledEnd = (end: number) => {
    setDisabledEnd(end);
    setDisabled({ start: disabledStart, end: getTime(end) });
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
              label={"Disabled Start"}
              disablePast
              value={disabledStart}
              onChange={(date) => date !== null && updateDisabledStart(date)}
              inputFormat="MMM dd, y hh:mm a"
              disableMaskedInput
            />
          </Grid>
          <Grid item xs={6}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label={"Disabled End"}
              disablePast
              minDateTime={disabledStart}
              value={disabledEnd}
              onChange={(date) => date !== null && updateDisabledEnd(date)}
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
