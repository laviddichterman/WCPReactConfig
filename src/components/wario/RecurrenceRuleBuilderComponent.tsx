import { endOfDay, getHours, getMinutes, getSeconds, getTime, setMilliseconds, setSeconds, toDate } from 'date-fns'
import { Grid, TextField } from "@mui/material";
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { IRecurringInterval, IWInterval } from "@wcp/wcpshared";
import { useAppSelector } from "../../hooks/useRedux";
import { ValSetVal, ValSetValNamed } from "../../utils/common";
import { ToggleBooleanPropertyComponent } from "./property-components/ToggleBooleanPropertyComponent";
import { useCallback, useMemo, useState } from 'react';
import { Frequency, RRule } from 'rrule';
import DatetimeBasedDisableComponent from './datetime_based_disable.component';

export type RecurrenceRuleBuilderComponentProps =
  ValSetVal<IRecurringInterval | null> &
  ValSetValNamed<boolean, 'availabilityIsValid'> & {
    disabled: boolean;
  };

// if useRRule === false, 
// ... IWInterval.start represents the epoch start time or -1 if unbounded, IWInterval.end if -1 is unbounded otherwise IWInterval.end is the epoch end time of the availability
// if useRRule === true...
// byTime is set to something that indicates the start time
// IWInterval.start is the ticks from the start of the rule representing the minutes from the start of the day [start, stop]
// if monthly 

const RecurrenceRuleBuilderComponent = (props: RecurrenceRuleBuilderComponentProps) => {
  const CURRENT_TIME = useAppSelector(s => s.ws.currentTime);
  const [specifyAvailability, setSpecifyAvailability] = useState(props.value !== null);
  const [useRRule, setUseRRule] = useState(props.value !== null && props.value.rrule !== "");
  const [localInterval, setLocalInterval] = useState<IWInterval>(props.value?.interval ?? { start: -1, end: -1 });
  const [frequency, setFreqency] = useState<Frequency>(Frequency.DAILY);
  const [rInterval, setRInterval] = useState<number>(1);
  const [byTime, setByTime] = useState<number>(Date.UTC(0, 0, 1, 12, 0, 0, 0));
  const [count, setCount] = useState<number | null>(null);
  const [until, setUntil] = useState<Date | null>(null);
  const [from, setFrom] = useState<Date | null>(null);
  // useCallback(() => {
  //   const rrule = new RRule({
  //     freq: frequency,
  //     dtstart: from,
  //     until,
  //     count,
  //     interval: rInterval,
  //     bysecond: getSeconds(byTime),
  //     byhour: getHours(byTime),
  //     byminute: getMinutes(byTime)
  //   });
  // }, [frequency, from, until, count, rInterval]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={specifyAvailability ? 6 : 12}>
        <ToggleBooleanPropertyComponent
          disabled={props.disabled}
          label="Specify Availability"
          value={specifyAvailability}
          setValue={setSpecifyAvailability}
        />
      </Grid>
      {specifyAvailability === true && (
        <>
        <Grid item xs={6}>
          <ToggleBooleanPropertyComponent
            disabled={props.disabled || !specifyAvailability}
            label="Use Recurrence Rule"
            value={useRRule}
            setValue={setUseRRule}
          />
        </Grid>
        { useRRule ? (
          
          "foo" // show recurrence rule stuff
        ) : (
          // show a from and to date-time picker similar to disable 
          <>
          <Grid item xs={12}>
            {`start: ${localInterval.start} end: ${localInterval.end}`}
          </Grid>
          <Grid item xs={6}>
            <DateTimePicker
              disabled={props.disabled}
              renderInput={(props) => <TextField fullWidth {...props}  />}
              label={"Start"}
              value={localInterval.start > 0 ? toDate(localInterval.start) : null}
              onChange={(date: Date) => setLocalInterval({ start: date && date.valueOf() > 0 ? setMilliseconds(setSeconds(date, 0), 0).valueOf() : -1, end: localInterval.end })}
              inputFormat="MMM dd, y hh:mm a"
              disableMaskedInput
            />
          </Grid>
          <Grid item xs={6}>
            <DateTimePicker
              disabled={props.disabled}
              renderInput={(props) => <TextField  fullWidth {...props} />}
              label={"End"}
              minDateTime={localInterval.start > 0 ? toDate(localInterval.start) : null}
              value={localInterval.end > 0 ? toDate(localInterval.end) : null}
              onChange={(date: Date) => setLocalInterval({ start: localInterval.start, end: date && date.valueOf() > 0 ? setMilliseconds(setSeconds(date, 0), 0).valueOf() : -1 })}
              inputFormat="MMM dd, y hh:mm a"
              disableMaskedInput
            />
          </Grid>
        </>
        )}
        </>
      )}

    </Grid>
  );
};

export default RecurrenceRuleBuilderComponent;
