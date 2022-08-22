import { endOfDay, getTime } from 'date-fns'
import { Grid, TextField } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers';
import { IWInterval } from "@wcp/wcpshared";
import { useAppSelector } from "../../hooks/useRedux";
import { ValSetVal } from "src/utils/common";
import { ToggleBooleanPropertyComponent } from "./property-components/ToggleBooleanPropertyComponent";

export type DatetimeBasedDisableComponentProps = {
  disabled: boolean;
} & ValSetVal<IWInterval | null>;

export const IsDisableValueValid = (value: IWInterval | null) => 
  value === null || (value.start === 1 && value.end === 0) || (value.start <= value.end); 

const DatetimeBasedDisableComponent = (props: DatetimeBasedDisableComponentProps) => {
  const CURRENT_TIME = useAppSelector(s => s.ws.currentTime);

  const updateDisabledStart = (start: number) => {
    props.setValue({ ...props.value!, start: getTime(start) });
  };

  const updateDisabledEnd = (end: number) => {
    props.setValue({ ...props.value!, end: getTime(end) });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <ToggleBooleanPropertyComponent
          disabled={props.disabled}
          label="Enabled"
          value={props.value === null}
          setValue={(enable) => props.setValue(enable ? null : { start: 1, end: 0 })}
          labelPlacement='end'
        />
      </Grid>
      {props.value !== null &&
        <Grid item xs={6}>
          <ToggleBooleanPropertyComponent
            disabled={props.disabled}
            label="Blanket Disable"
            value={props.value.start === 1 && props.value.end === 0}
            setValue={(isBlanket) => props.setValue(isBlanket ? 
              { start: 1, end: 0 } : 
              { start: CURRENT_TIME, end: getTime(endOfDay(CURRENT_TIME)) })}
            labelPlacement='end'
          />
        </Grid>
      }
      {(props.value !== null && props.value.start !== 1 && props.value.end !== 0) &&
        <>
          <Grid item xs={6}>
            <DateTimePicker
              renderInput={(props) => <TextField fullWidth {...props} />}
              label={"Disabled Start"}
              disablePast
              value={props.value.start}
              onChange={(date) => date !== null && updateDisabledStart(date)}
              inputFormat="MMM dd, y hh:mm a"
              disableMaskedInput
            />
          </Grid>
          <Grid item xs={6}>
            <DateTimePicker
              renderInput={(props) => <TextField fullWidth {...props} />}
              label={"Disabled End"}
              disablePast
              minDateTime={props.value.start}
              value={props.value.end}
              onChange={(date) => date !== null && updateDisabledEnd(date)}
              inputFormat="MMM dd, y hh:mm a"
              disableMaskedInput
            />
          </Grid>
        </>}
    </Grid>
  );
};

export default DatetimeBasedDisableComponent;
