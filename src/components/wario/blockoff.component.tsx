import React, { useState, useMemo, useCallback } from "react";
import { add, format, parse } from "date-fns";
import {
  Card,
  CardHeader,
  Chip,
  Container,
  Grid,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Autocomplete
} from '@mui/material'
import { Done, HighlightOff } from '@mui/icons-material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useAuth0 } from '@auth0/auth0-react';
import { JSFEBlockedOff, WDateUtils, WIntervalTuple } from "@wcp/wcpshared";

import { useAppSelector } from "../../hooks/useRedux";
import { HOST_API } from '../../config';


const TrimOptionsBeforeDisabled = function <T extends { disabled: boolean; }>(opts: T[]) {
  const idx = opts.findIndex((elt: T) => elt.disabled);
  return idx === -1 ? opts : opts.slice(0, idx);
}

interface ServiceSelectionCheckboxProps {
  selected: boolean;
  onChange: React.MouseEventHandler<HTMLDivElement>;
  service_name: React.ReactNode;
}

const ServiceSelectionCheckbox = (props: ServiceSelectionCheckboxProps) => {
  const { selected, onChange, service_name } = props;
  return (
    <Chip
      label={service_name}
      clickable
      onDelete={(e) => onChange(e)}
      onClick={(e) => onChange(e)}
      color={selected ? "primary" : "default"}
      deleteIcon={selected ? <Done /> : <HighlightOff />}
    />
  )
}

const BlockOffComp = () => {
  const SERVICES = useAppSelector(s => s.ws.services!);
  const BLOCKED_OFF = useAppSelector(s => s.ws.blockedOff!);
  const SETTINGS = useAppSelector(s => s.ws.settings!);
  const LEAD_TIME = useAppSelector(s => s.ws.leadtime!);
  const CURRENT_TIME = useAppSelector(s=>s.timing.currentTime!);
  const NUM_SERVICES = useMemo(() => SERVICES !== null ? Object.keys(SERVICES).length : 3, [SERVICES]);
  const [upper_time, setUpperTime] = useState<number | null>(null);
  const [lower_time, setLowerTime] = useState<number | null>(null);
  const [selected_date, setSelectedDate] = useState<Date | null>(new Date());
  const [parsed_date, setParsedDate] = useState(format(new Date(), WDateUtils.DATE_STRING_INTERNAL_FORMAT));
  const [service_selection, setServiceSelection] = useState<boolean[]>(Array(NUM_SERVICES).fill(true));
  const can_submit = useMemo(() => upper_time !== null && lower_time !== null && selected_date !== null, [upper_time, lower_time, selected_date]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const GetInfoMapForAvailability = useCallback((date: Date | number) => WDateUtils.GetInfoMapForAvailabilityComputation(BLOCKED_OFF, SETTINGS, LEAD_TIME, date, service_selection, { cart_based_lead_time: 0, size: 1 }), [BLOCKED_OFF, LEAD_TIME, SETTINGS, service_selection])
  const GetOptionsForDate = useCallback((date: Date | number) => WDateUtils.GetOptionsForDate(GetInfoMapForAvailability(date), date, CURRENT_TIME), [GetInfoMapForAvailability, CURRENT_TIME]);
  const HasOptionsForDate = useCallback((date: Date | number) => GetOptionsForDate(date).filter(x => !x.disabled).length, [GetOptionsForDate]);
  const startOptions = useMemo(() => selected_date !== null ? GetOptionsForDate(selected_date) : [], [selected_date, GetOptionsForDate]);
  const endOptions = useMemo(() => selected_date !== null && lower_time !== null ?
    TrimOptionsBeforeDisabled(startOptions.filter(x => x.value >= lower_time)) : [],
    [selected_date, lower_time, startOptions])
  const postBlockedOff = useCallback(async (new_blocked_off: JSFEBlockedOff) => {
    try {
      const token = await getAccessTokenSilently({ scope: "write:order_config" });
      const response = await fetch(
        `${HOST_API}/api/v1/config/timing/blockoff`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(new_blocked_off),
        }
      );
      // eslint-disable-next-line no-empty
      if (response.status === 201) {
      }
    } catch (error) {
      console.error(error);
    }
  }, [getAccessTokenSilently]);

  const addBlockedOffInterval = useCallback((parsed_date: string, interval: WIntervalTuple) => {
    if (!isProcessing) {
      setIsProcessing(true);
      const new_blocked_off = structuredClone(BLOCKED_OFF);
      // iterate over services
      service_selection.forEach((enabled, i) => {
        if (enabled) {
          WDateUtils.AddIntervalToService(i, parsed_date, interval, new_blocked_off);
        }
      });
      postBlockedOff(new_blocked_off);
      setIsProcessing(false);
    }
  }, [service_selection, isProcessing, postBlockedOff, BLOCKED_OFF])
  const removeBlockedOffForDate = (service_index: number, day_index: number) => {
    if (!isProcessing) {
      setIsProcessing(true);
      let new_blocked_off = structuredClone(BLOCKED_OFF);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < BLOCKED_OFF[service_index][day_index][1].length; ++i) {
        new_blocked_off = WDateUtils.RemoveIntervalFromBlockedOffWireFormat(
          service_index,
          day_index,
          0,
          new_blocked_off);
      }
      postBlockedOff(new_blocked_off);
      setIsProcessing(false);
    }
  }
  if (SERVICES === null || SETTINGS === null || LEAD_TIME === null) {
    return <>Loading...</>;
  }

  const removeBlockedOffInterval = (service_index: number, day_index: number, interval_index: number) => {
    if (!isProcessing) {
      setIsProcessing(true);
      const new_blocked_off = WDateUtils.RemoveIntervalFromBlockedOffWireFormat(
        service_index,
        day_index,
        interval_index,
        BLOCKED_OFF);
      postBlockedOff(new_blocked_off);
      setIsProcessing(false);
    }
  }

  const onChangeServiceSelection = (i: number) => {
    const new_service_selection = service_selection.slice();
    new_service_selection[i] = !new_service_selection[i];
    setServiceSelection(new_service_selection);
    if (selected_date && !HasOptionsForDate(selected_date)) {
      setDate(null);
    }
  }

  const onChangeLowerBound = (e: number) => {
    let new_upper;
    if (upper_time) {
      new_upper = upper_time < e ? e : upper_time;
    }
    else {
      new_upper = e;
    }
    if (!e) {
      new_upper = null;
    }
    setLowerTime(e);
    setUpperTime(new_upper);
  }
  const onChangeUpperBound = (e: number) => {
    setUpperTime(e);
  }
  const setDate = (date: Date | null) => {
    setSelectedDate(date);
    setParsedDate(date !== null ?
      format(date, WDateUtils.DATE_STRING_INTERNAL_FORMAT) :
      "");
    setLowerTime(null);
    setUpperTime(null);
  }

  const handleSubmit = () => {
    if (selected_date && lower_time !== null && upper_time !== null) {
      addBlockedOffInterval(parsed_date, [lower_time, upper_time]);
      if (!HasOptionsForDate(selected_date)) {
        setDate(null);
      }
      else {
        setLowerTime(null);
        setUpperTime(null);
      }
    }
  }
  const services_checkboxes = Object.values(SERVICES).map((x, i) => (
    <Grid item xs={Math.floor(12 / NUM_SERVICES)} key={i}>
      <ServiceSelectionCheckbox
        service_name={x}
        selected={service_selection[i]}
        onChange={() => onChangeServiceSelection(i)}
      />
    </Grid>
  ));
  const blocked_off_html = BLOCKED_OFF ? BLOCKED_OFF.map((_, i) => {
    const blocked_off_days_html = BLOCKED_OFF[i].map((_, j) => {
      const blocked_off_intervals_html = BLOCKED_OFF[i][j][1].map((_, k) => {
        const from_to = BLOCKED_OFF[i][j][1][k][0] === BLOCKED_OFF[i][j][1][k][1] ? WDateUtils.MinutesToPrintTime(BLOCKED_OFF[i][j][1][k][0]) : `${WDateUtils.MinutesToPrintTime(BLOCKED_OFF[i][j][1][k][0])} to ${WDateUtils.MinutesToPrintTime(BLOCKED_OFF[i][j][1][k][1])}`;
        return (
          <ListItem key={k}>
            <ListItemText primary={from_to} />
            <ListItemSecondaryAction>
              <IconButton edge="end" size="small" disabled={isProcessing} aria-label="delete" onClick={() => removeBlockedOffInterval(i, j, k)}>
                <HighlightOff />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })
      return (
        <Container key={j}>
          <ListItem>
            {format(parse(BLOCKED_OFF[i][j][0], WDateUtils.DATE_STRING_INTERNAL_FORMAT, CURRENT_TIME), 'EEEE, MMMM dd, y')}
            <ListItemSecondaryAction>
              <IconButton edge="end" size="small" disabled={isProcessing} aria-label="delete" onClick={() => removeBlockedOffForDate(i, j)}>
                <HighlightOff />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <List sx={{ ml: 2 }}>
            {blocked_off_intervals_html}
          </List>
        </Container>
      );
    })
    return (
      <Grid key={i} item xs={Math.floor(12 / NUM_SERVICES)}>
        <Card>
          <CardHeader title={SERVICES[i]} />
          <List component="nav">
            {blocked_off_days_html}
          </List>
        </Card>
      </Grid>
    );
  }) : "";

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Add Blocked-Off Time:" sx={{ mb: 3 }} />
          <Grid container justifyContent="center">
            <Grid item xs={8}>
              <Grid sx={{ ml: 6 }} container>{services_checkboxes}</Grid>
            </Grid>
            <Grid item xs={4}>
              <MobileDatePicker
                renderInput={(props) => <TextField {...props} />}
                closeOnSelect
                showToolbar={false}
                minDate={new Date(CURRENT_TIME)}
                maxDate={add(CURRENT_TIME, { days: 60 })}
                shouldDisableDate={e => !HasOptionsForDate(e)}
                value={selected_date}
                onChange={(date) => setDate(date)}
                inputFormat="EEEE, MMMM dd, y"
              />
            </Grid>
            <Grid item xs={5}>
              <Autocomplete
                sx={{ m: 2 }}
                disableClearable
                className="col"
                options={startOptions.filter(x=>!x.disabled).map(x=>x.value)}
                isOptionEqualToValue={(o, v) => o === v}
                getOptionLabel={x => WDateUtils.MinutesToPrintTime(x)}
                // @ts-ignore
                value={lower_time}
                onChange={(_, v) => onChangeLowerBound(v)}
                disabled={!selected_date}
                renderInput={(params) => <TextField {...params} label={"Start"}
                />}
              />
            </Grid>
            <Grid item xs={5}>
            <Autocomplete
                sx={{ m: 2 }}
                disableClearable
                className="col"
                options={endOptions.filter(x=>!x.disabled).map(x=>x.value)}
                isOptionEqualToValue={(o, v) => o === v}
                getOptionLabel={x => WDateUtils.MinutesToPrintTime(x)}
                // @ts-ignore
                value={upper_time}
                onChange={(_, v) => onChangeUpperBound(v)}
                disabled={!(selected_date && lower_time)}
                renderInput={(params) => <TextField {...params} label={"End"}
                />}
              />
            </Grid>
            <Grid item xs={2}><Button sx={{ m: 3 }} onClick={() => handleSubmit()} disabled={!can_submit || isProcessing}>Add</Button></Grid>
          </Grid>
        </Card>
      </Grid>
      {blocked_off_html}
    </>
  );
}

export default BlockOffComp;