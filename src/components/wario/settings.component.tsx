import React, { useState, useMemo } from 'react';
import { format, setDay } from 'date-fns';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Card, CardHeader, Grid, Button, IconButton } from '@mui/material';

import { IWSettings, WDateUtils, WIntervalTuple } from "@wcp/wcpshared";
import { useAuth0 } from '@auth0/auth0-react';
import TimeSelection from "./timepicker.component";
import {HOST_API} from '../../config';
import { CheckedNumericInput } from './CheckedNumericTextInput';
import { useAppSelector } from '../../hooks/useRedux';

export interface OperatingHoursIntervalFormProps { 
  time_step: number;
  interval, 
  onChangeLowerBound, 
  onChangeUpperBound,
  disabled: boolean;
  onAddOperatingHours 
};

const OperatingHoursIntervalForm = ({
  time_step, 
  interval, 
  onChangeLowerBound, 
  onChangeUpperBound,
  disabled,
  onAddOperatingHours
} : OperatingHoursIntervalFormProps) => {
  const startOptions = useMemo(() => {
    let earliest = 0;
    const latest = 1440-time_step;
    const retval = [];
    while (earliest <= latest) {
      retval.push({ value: earliest, label: WDateUtils.MinutesToPrintTime(earliest)});
      earliest += time_step;
    }
    return retval;
  }, [time_step]);
 
  const endOptions = interval.start ?
    startOptions.filter(x => x.value >= interval.start.value) : [];
  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={5}>
        <TimeSelection
          onChange={(e, v) => onChangeLowerBound(v)}
          value={interval.start}
          optionCaption={"Start"}
          disabled={disabled}
          // className="col-2"
          options={startOptions}
          isOptionDisabled={() => false}
        />
      </Grid>
      <Grid item xs={5}>
        <TimeSelection
          onChange={(e, v) => onChangeUpperBound(v)}
          value={interval.end}
          optionCaption={"End"}
          disabled={!interval.start || disabled}
          // className="col-2"
          options={endOptions}
          isOptionDisabled={() => false}
        />
      </Grid>
      <Grid item xs={2}>
        <Button className="btn btn-light" 
          disabled={!interval.start || !interval.end || disabled}
          onClick={onAddOperatingHours}>Add</Button>
      </Grid>
    </Grid>
  );
}

const GenerateInitialOperatingHoursFormIntervals = (num_services : number) => Array(num_services).fill(Array(7).fill({start: null, end:null}))

const SettingsComponent = ({}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [isProcessing, setIsProcessing] = useState(false);
  const services = useAppSelector(s=>s.ws.services);
  const settings = useAppSelector(s=>s.ws.settings);
  const numServices = useMemo(()=> services !== null ? Object.keys(services).length : 3, [services]);
  const [ localSettings, setLocalSettings ] = useState<IWSettings>(settings);
  const [operating_hours_form_intervals, setOperatingHoursFormIntervals] = useState(GenerateInitialOperatingHoursFormIntervals(numServices));
  if (!services || !services.length || !settings) {
    return <>Loading...</>;
  }

  const onSubmit = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:order_config"} );
        const response = await fetch(`${HOST_API}/api/v1/config/settings`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(localSettings)
        });
        if (response.status === 201) {
          await response.json()
          setLocalSettings(settings);
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };
  const onChangeAdditionalPizzaLeadTime = (e : number) => {
    const new_settings = JSON.parse(JSON.stringify(localSettings));
    new_settings.additional_pizza_lead_time = e;
    setLocalSettings(new_settings);
  }

  const onChangeTimeStep = (value: string, service_idx : number) => {
    const new_settings = JSON.parse(JSON.stringify(localSettings));
    new_settings.time_step2[service_idx] = parseInt(value, 10);
    setLocalSettings(new_settings);
  }

  const onAddOperatingHours = (service_index : number, day_index : number , interval : WIntervalTuple) => {
    const new_settings = JSON.parse(JSON.stringify(localSettings));
    WDateUtils.AddIntervalToOperatingHours(
      service_index,
      day_index,
      interval,
      new_settings.operating_hours);
    setLocalSettings(new_settings);
  }

  const onRemoveOperatingHours = (service_index : number, day_index : number, interval_index : number) => {
    const new_settings = JSON.parse(JSON.stringify(localSettings));
    const new_operating_hours = WDateUtils.RemoveIntervalFromOperatingHours(
      service_index,
      day_index,
      interval_index,
      new_settings.operating_hours);
    new_settings.operating_hours = new_operating_hours;
    setLocalSettings(new_settings);
  }

  const onSetUpperBound = (service_index : number, day_index: number, e) => {
    const new_intervals = JSON.parse(JSON.stringify(operating_hours_form_intervals));
    new_intervals[service_index][day_index] = {start: new_intervals[service_index][day_index].start, end: e};
    setOperatingHoursFormIntervals(new_intervals);
  }
  const onSetLowerBound = (service_index: number, day_index: number, e) => {
    const new_intervals = JSON.parse(JSON.stringify(operating_hours_form_intervals));
    let new_end = new_intervals[service_index][day_index].end;
    if (e && new_end && new_end.value < e.value) {
      new_end = null;
    }
    new_intervals[service_index][day_index] = {start: e, end: new_end};
    setOperatingHoursFormIntervals(new_intervals);
  }
  const AddOperatingHoursInterval = (service_index: number, day_index: number) => {
    const interval = operating_hours_form_intervals[service_index][day_index];
    onAddOperatingHours(
      service_index,
      day_index,
      [interval.start.value, interval.end.value]);
    onSetLowerBound(service_index, day_index, null);
    onSetUpperBound(service_index, day_index, null);
    const new_intervals = JSON.parse(JSON.stringify(operating_hours_form_intervals));
    new_intervals[service_index][day_index] = {start: null, end: null};
    setOperatingHoursFormIntervals(new_intervals);
    console.log(new_intervals[service_index][day_index]);
  }

  const timestep_html = useMemo(() => Object.keys(services).map((key, i) => (
      <Grid item xs={Math.floor(12/numServices)} key={key}>
        <CheckedInputComponent
          label={`${services[key]} Time Step (minutes)`}
          className="form-control"
          type="number"
          inputProps={{min: 1, max: 1440}}
          value={settings.time_step[i]}
          onFinishChanging={(value : string) => onChangeTimeStep(value, i)}
          />
      </Grid>
    )), []);

  const operating_hours_service_html = localSettings.operating_hours.map((operating_hours_week, h) => {
    const operating_hours_week_html = operating_hours_week.map((operating_hours_day, i) => {
      const operating_hours_day_intervals_html = operating_hours_day.map((interval, j) => (
          <Grid item xs={2} container key={j}>
            <Grid item xs={10}>
              {WDateUtils.MinutesToPrintTime(interval[0])}
              &nbsp;-&nbsp;
              {WDateUtils.MinutesToPrintTime(interval[1])}
            </Grid>
            <Grid item xs={2}>
              <IconButton edge="end" size="small" aria-label="delete" onClick={() => onRemoveOperatingHours(h, i, j)}>
                <HighlightOffIcon />
              </IconButton>
            </Grid>
          </Grid>
        ));
      return (
        <Grid container item xs={12} key={i}>
          <Grid item xs={1}>
            {format(setDay(new Date(), i), 'EEEE')}:
          </Grid>
          {operating_hours_day_intervals_html}
          <Grid item xs />
          <Grid item xs={4}>
            <OperatingHoursIntervalForm
              disabled={false}
              interval={operating_hours_form_intervals[h][i]}
              onChangeLowerBound={e => onSetLowerBound(h, i, e)}
              onChangeUpperBound={e => onSetUpperBound(h, i, e)}
              onAddOperatingHours={() => AddOperatingHoursInterval(h, i)}
              time_step={localSettings.time_step[h]}
              />
          </Grid>
        </Grid>
      );
    });
    return (
      <Card sx={{p:3}} key={h}>
        <CardHeader title={services[h]} />
        {operating_hours_week_html}
      </Card>
    );
  });
  // eslint-disable-next-line consistent-return
  return (
    <div>
      <Card>
        <CardHeader title={"Operating Hours Configuration"} subtitle={"Dangerous settings (requires PUSH CHANGES to take effect):"} />
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            {operating_hours_service_html}
          </Grid>
          <Grid item xs={2}>
            <CheckedNumericInput 
              type="number"
              label="Additional lead time per pizza beyond the first"
              inputProps={{ inputMode: 'numeric', min: 0, max: 64, pattern: '[0-9]*' }} 
              value={localSettings.additional_pizza_lead_time} 
              className="form-control" 
              disabled={isProcessing}
              onChange={onChangeAdditionalPizzaLeadTime} 
              parseFunction={parseInt}
              allowEmpty={false} />
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={3}>
              {timestep_html}
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={onSubmit}>Push Changes</Button>
          </Grid>          
        </Grid>
      </Card>
    </div>
  );
}


export default SettingsComponent;