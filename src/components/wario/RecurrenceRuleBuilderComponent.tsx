import { differenceInMinutes, format, isValid, setDay, setMilliseconds, setMinutes, setMonth, setSeconds, startOfDay, toDate } from 'date-fns'
import { Autocomplete, Grid, TextField } from "@mui/material";
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { IRecurringInterval, IWInterval, WDateUtils } from "@wcp/wcpshared";
import { ValSetVal, ValSetValNamed } from "../../utils/common";
import { ToggleBooleanPropertyComponent } from "./property-components/ToggleBooleanPropertyComponent";
import { useEffect, useMemo, useState } from 'react';
import { Frequency, RRule, Weekday } from 'rrule';
import { IntNumericPropertyComponent } from './property-components/IntNumericPropertyComponent';
import { CheckedNumericInput } from './CheckedNumericTextInput';
import { MappingEnumPropertyComponent } from './property-components/MappingEnumPropertyComponent';


export type RecurrenceRuleBuilderComponentProps =
  ValSetVal<IRecurringInterval | null> &
  ValSetValNamed<boolean, 'availabilityIsValid'> & {
    disabled: boolean;
  };

// if useRRule === false, 
// ... IWInterval.start represents the epoch start time or -1 if unbounded, IWInterval.end if -1 is unbounded otherwise IWInterval.end is the epoch end time of the availability
// ... IWInterval.rrule === ""
// if useRRule === true...
// ...IWInterval.start,end is the minutes from the matching day of the rule representing the minutes from the start/end of the day [start, end]
// ...IWInterval.rrule is the toString representation of the recurrence rule
// 

const RecurrenceRuleBuilderComponent = (props: RecurrenceRuleBuilderComponentProps) => {
  const { setAvailabilityIsValid, setValue } = props;
  const [specifyAvailability, setSpecifyAvailability] = useState(props.value !== null);
  const [useRRule, setUseRRule] = useState(props.value !== null && props.value.rrule !== "");
  const [localInterval, setLocalInterval] = useState<IWInterval>(props.value?.interval ?? { start: -1, end: -1 });
  const [frequency, setFreqency] = useState<Frequency>(props.value?.rrule ? RRule.fromString(props.value.rrule).options.freq : Frequency.WEEKLY);
  const [rInterval, setRInterval] = useState<number>(props.value?.rrule ? RRule.fromString(props.value.rrule).options.interval : 1);
  const [byWeekDay, setByWeekDay] = useState<Weekday[]>(props.value?.rrule ? RRule.fromString(props.value.rrule).options.byweekday?.map(x=>new Weekday(x)) ?? [] : []);
  const [byMonth, setByMonth] = useState<number[]>(props.value?.rrule ? RRule.fromString(props.value.rrule).options.bymonth ?? [] : []);
  const [count, setCount] = useState<number | null>(null);
  // const [until, setUntil] = useState<Date | null>(null);
  // const [from, setFrom] = useState<Date | null>(null);
  const currentRRule = useMemo(() => {
    if (useRRule) {
      try {
        const rrule = new RRule({
          freq: frequency,
          // dtstart: from,
          // until,
          count,
          interval: rInterval,
          byweekday: byWeekDay.length === 0 ? undefined : byWeekDay,
          bymonth: byMonth.length === 0 ? undefined : byMonth
        });
        return rrule;
      }
      catch (err: any) {
        console.log({ err })
      }
    }
  }, [useRRule, frequency, count, rInterval, byWeekDay, byMonth]);
  useEffect(() => {
    if (!specifyAvailability) {
      setAvailabilityIsValid(true);
      setValue(null);
      return;
    }
    if ((useRRule && localInterval.start > localInterval.end) || 
    (useRRule && currentRRule === undefined) ||
    (!useRRule && localInterval.start > 0 && localInterval.end > 0 && localInterval.start > localInterval.end)) {
      setAvailabilityIsValid(false);
      return;
    }
    setValue({ interval: localInterval, rrule: currentRRule?.toString() ?? "" });
    setAvailabilityIsValid(true);
  }, [localInterval, currentRRule, useRRule, setAvailabilityIsValid, setValue, specifyAvailability]);

  const handleSetUseRRule = (newValue: boolean) => {
    if (useRRule === true && newValue === false) {
      setLocalInterval({ start: -1, end: -1 });
    }
    else if (useRRule === false && newValue === true) {
      setLocalInterval({ start: 0, end: 1439 });
    }
    setUseRRule(newValue);
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {!specifyAvailability ? "" : (props.availabilityIsValid ? (currentRRule ? (`${currentRRule.toText()} from ${WDateUtils.MinutesToPrintTime(localInterval.start)} to ${WDateUtils.MinutesToPrintTime(localInterval.end)}`) : `${localInterval.start === -1 ? 'The Beginning of Time' : format(localInterval.start, WDateUtils.ISODateTimeNoOffset)} to ${localInterval.end === -1 ? 'The End of Time' : format(localInterval.end, WDateUtils.ISODateTimeNoOffset)}`) : "Availability is not valid")}
      </Grid>
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
              setValue={handleSetUseRRule}
            />
          </Grid>
          {useRRule ? (
            <>
              <Grid container item xs={6} sm={4}>
                <MappingEnumPropertyComponent
                  disabled={props.disabled}
                  label="Frequency"
                  value={frequency}
                  setValue={setFreqency}
                  options={{ 'Daily': Frequency.DAILY, 'Weekly': Frequency.WEEKLY, 'Monthly': Frequency.MONTHLY }}
                />
              </Grid>

              <Grid item xs={6} sm={4}>
                <CheckedNumericInput
                  label="Count"
                  type="number"
                  inputProps={{ inputMode: 'numeric', min: 1, pattern: '[0-9]*', step: 1 }}
                  value={count}
                  disabled={props.disabled}
                  onChange={(e) => setCount(e)}
                  parseFunction={(v) => v !== null && v ? parseInt(v) : null}
                  allowEmpty={true} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <IntNumericPropertyComponent
                  disabled={props.disabled}
                  label="Interval"
                  value={rInterval}
                  setValue={setRInterval}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  options={[RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA, RRule.SU,]}
                  value={byWeekDay}
                  onChange={(_, v: Weekday[]) => setByWeekDay(v.sort((a, b) => a.getJsWeekday() - b.getJsWeekday()))}
                  getOptionLabel={(option) => format(setDay(Date.now(), option.getJsWeekday()), 'EEEE')}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderInput={(params) => <TextField {...params} label="By Weekday" />}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                  value={byMonth}
                  onChange={(_, v: number[]) => setByMonth(v.sort())}
                  getOptionLabel={(option) => format(setMonth(Date.now(), option - 1), 'MMM')}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderInput={(params) => <TextField {...params} label="By Month" />}
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  label="From Time"
                  //maxTime={setMinutes(startOfDay(Date.now()), localInterval.end)}
                  value={setMinutes(startOfDay(Date.now()), localInterval.start)}
                  onChange={(e) => e !== null && isValid(e) ? setLocalInterval({ ...localInterval, start: differenceInMinutes(e, startOfDay(Date.now())) }) : 0}
                  renderInput={(params) => <TextField {...params} fullWidth label="From Time" />}
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  label="Until Time"
                  //minTime={setMinutes(startOfDay(Date.now()), localInterval.start)}
                  value={setMinutes(startOfDay(Date.now()), localInterval.end)}
                  onChange={(e) => {
                    console.log({ e })
                    return e !== null && isValid(e) ? setLocalInterval({ ...localInterval, end: differenceInMinutes(e, startOfDay(Date.now())) }) : 1439
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth label="Until Time" />}
                />
              </Grid>
            </>
          ) : (
            // show a from and to date-time picker similar to disable 
            <>
              <Grid item xs={6}>
                <DateTimePicker
                  disabled={props.disabled}
                  renderInput={(props) => <TextField fullWidth {...props} />}
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
                  renderInput={(props) => <TextField fullWidth {...props} />}
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
