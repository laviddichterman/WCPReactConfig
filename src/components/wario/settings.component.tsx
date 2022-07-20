import React, { useState, useMemo, useCallback } from 'react';
import { format, setDay } from 'date-fns';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Card, CardHeader, Grid, Button, IconButton, Autocomplete, TextField } from '@mui/material';

import { IWSettings, WDateUtils, WIntervalTuple } from "@wcp/wcpshared";
import { useAuth0 } from '@auth0/auth0-react';
import { HOST_API } from '../../config';
import { CheckedNumericInput } from './CheckedNumericTextInput';
import { useAppSelector } from '../../hooks/useRedux';

export interface OperatingHoursIntervalFormProps {
  time_step: number;
  disabled: boolean;
  onAddOperatingHours: (interval: WIntervalTuple) => void;
};

const OperatingHoursIntervalForm = ({
  time_step,
  disabled,
  onAddOperatingHours
}: OperatingHoursIntervalFormProps) => {
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const onSubmitHandler = () => {
    onAddOperatingHours([start, end] as WIntervalTuple);
    setStart(null);
    setEnd(null);
  }
  const startOptions = useMemo(() => {
    let earliest = 0;
    const latest = 1440 - time_step;
    const retval = [];
    while (earliest <= latest) {
      retval.push(earliest);
      earliest += time_step;
    }
    return retval;
  }, [time_step]);

  const endOptions = useMemo(() => start !== null ?
    startOptions.filter(x => x >= start) : [], [start, startOptions]);

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={5}>
        <Autocomplete
          disablePortal
          disableClearable
          options={startOptions}
          isOptionEqualToValue={(o, v) => o === v}
          getOptionLabel={x => WDateUtils.MinutesToPrintTime(x)}
          // @ts-ignore
          value={start}
          onChange={(_, v) => setStart(v)}
          renderInput={(params) => <TextField {...params} label={"Start"}
          />}
        />
      </Grid>
      <Grid item xs={5}>
        <Autocomplete
          disablePortal
          disableClearable
          options={endOptions}
          isOptionEqualToValue={(o, v) => o === v}
          getOptionLabel={x => WDateUtils.MinutesToPrintTime(x)}
          // @ts-ignore
          value={end}
          disabled={start === null || disabled}
          onChange={(_, v) => setEnd(v)}
          renderInput={(params) => <TextField {...params} label={"End"}
          />}
        />
      </Grid>
      <Grid item xs={2}>
        <Button className="btn btn-light"
          disabled={start === null || end === null || disabled}
          onClick={() => onSubmitHandler()}>Add</Button>
      </Grid>
    </Grid>
  );
}

const SettingsComponent = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [isProcessing, setIsProcessing] = useState(false);
  const services = useAppSelector(s => s.ws.services);
  const settings = useAppSelector(s => s.ws.settings);
  const numServices = useMemo(() => services !== null ? Object.keys(services).length : 3, [services]);
  const [localSettings, setLocalSettings] = useState<IWSettings>(settings as IWSettings);
  const onChangeTimeStep = useCallback((value: number, service_idx: number) => {
    const new_settings = structuredClone(localSettings);
    new_settings.time_step[service_idx] = value;
    setLocalSettings(new_settings);
  }, [localSettings, setLocalSettings]);

  const timestep_html = useMemo(() => services !== null && settings !== null && Object.keys(services).map((key, i) => (
    <Grid item xs={Math.floor(12 / numServices)} key={key}>
      <CheckedNumericInput
        type="number"
        label={`${services[key]} Time Step (minutes)`}
        inputProps={{ inputMode: 'numeric', min: 1, max: 1440, pattern: '[0-9]*', step: 1 }}
        value={settings.time_step[i]}
        className="form-control"
        disabled={isProcessing}
        onChange={(e) => onChangeTimeStep(e, i)}
        parseFunction={parseInt}
        allowEmpty={false} />
    </Grid>
  )), [isProcessing, numServices, onChangeTimeStep, services, settings]);
  if (!services || !services.length || !settings) {
    return <>Loading...</>;
  }

  const onSubmit = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:order_config" });
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
  const onChangeAdditionalPizzaLeadTime = (e: number) => {
    setLocalSettings({ ...localSettings, additional_pizza_lead_time: e });
  }


  const onAddOperatingHours = (service_index: number, day_index: number, interval: WIntervalTuple) => {
    const new_settings = structuredClone(localSettings);
    WDateUtils.AddIntervalToOperatingHours(
      service_index,
      day_index,
      interval,
      new_settings.operating_hours);
    setLocalSettings(new_settings);
  }

  const onRemoveOperatingHours = (service_index: number, day_index: number, interval_index: number) => {
    const new_settings = structuredClone(localSettings);
    const new_operating_hours = WDateUtils.RemoveIntervalFromOperatingHours(
      service_index,
      day_index,
      interval_index,
      new_settings.operating_hours);
    new_settings.operating_hours = new_operating_hours;
    setLocalSettings(new_settings);
  }

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
              onAddOperatingHours={(interval) => onAddOperatingHours(h, i, interval)}
              time_step={localSettings.time_step[h]}
            />
          </Grid>
        </Grid>
      );
    });
    return (
      <Card sx={{ p: 3 }} key={h}>
        <CardHeader title={services[h]} />
        {operating_hours_week_html}
      </Card>
    );
  });
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
              inputProps={{ inputMode: 'numeric', min: 0, max: 64, pattern: '[0-9]*', step: 1 }}
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