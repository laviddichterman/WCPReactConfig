import React, { useState } from "react";
import { add, format, parse } from "date-fns";
import { Card, 
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
  TextField } from '@mui/material'
import { Done, HighlightOff } from '@mui/icons-material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useAuth0 } from '@auth0/auth0-react';
import { WDateUtils } from "@wcp/wcpshared";

import TimeSelection from "./timepicker.component";

const TrimOptionsBeforeDisabled = (opts) => {
  const idx = opts.findIndex((elt) => elt.disabled);
  return idx === -1 ? opts : opts.slice(0, idx);
}


const ServiceSelectionCheckbox = (props) => {
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

const BlockOffComp = ({
  ENDPOINT,
  SERVICES, 
  BLOCKED_OFF,
  setBLOCKED_OFF,
  SETTINGS,
  LEAD_TIME
}) => {
  const [ upper_time, setUpperTime ] = useState(null);
  const [ lower_time, setLowerTime ] = useState(null);
  const [ selected_date, setSelectedDate ] = useState(new Date());
  const [ parsed_date, setParsedDate ] = useState(format(new Date(), WDateUtils.DATE_STRING_INTERNAL_FORMAT));
  const [ service_selection, setServiceSelection ] = useState(Array(SERVICES.length).fill(true));
  const [ can_submit, setCanSubmit ] = useState(false);
  const [ isProcessing, setIsProcessing ] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  

  const HasOptionsForDate = (date) => {
    const INFO = WDateUtils.GetInfoMapForAvailabilityComputation(BLOCKED_OFF, SETTINGS, LEAD_TIME, date, service_selection, {});
    return WDateUtils.GetOptionsForDate(INFO, date, new Date()).filter(x => !x.disabled).length
  }

  const postBlockedOff = async (new_blocked_off) => {
    try {
      const token = await getAccessTokenSilently( { scope: "write:order_config"} );
      const response = await fetch(
        `${ENDPOINT}/api/v1/config/timing/blockoff`,
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
  };


  const addBlockedOffInterval = (parsed_date, interval, service_selection) => {
    if (!isProcessing) {
      setIsProcessing(true);
      const new_blocked_off = BLOCKED_OFF.slice();
      // iterate over services
      // eslint-disable-next-line no-restricted-syntax
      for (const service_index in service_selection) {
        if (service_selection[service_index]) {
          WDateUtils.AddIntervalToService(service_index, parsed_date, interval, new_blocked_off);
        }
      }
      postBlockedOff(new_blocked_off);
      setBLOCKED_OFF(new_blocked_off);
      setIsProcessing(false);
    }
  }
  const removeBlockedOffForDate = (service_index, day_index) => {
    if (!isProcessing) {
      setIsProcessing(true);
      let new_blocked_off = BLOCKED_OFF;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < BLOCKED_OFF[service_index][day_index][1].length; ++i) {
        new_blocked_off = WDateUtils.RemoveIntervalFromBlockedOffWireFormat(
          service_index,
          day_index,
          0,
          new_blocked_off);
      }
      postBlockedOff(new_blocked_off);
      setBLOCKED_OFF(new_blocked_off);
      setIsProcessing(false);
    }
  }


  const removeBlockedOffInterval = (service_index, day_index, interval_index) => {
    if (!isProcessing) {
      setIsProcessing(true);
      const new_blocked_off = WDateUtils.RemoveIntervalFromBlockedOffWireFormat(
        service_index,
        day_index,
        interval_index,
        BLOCKED_OFF);
      postBlockedOff(new_blocked_off);
      setBLOCKED_OFF(new_blocked_off);
      setIsProcessing(false);
    }
  }

  // const removeBlockedOffIntervalForService = async (service, day_index, interval_index) => {
  //   // try {
  //   //   const token = await getAccessTokenSilently();
  //   //   const response = await fetch(
  //   //     `${ENDPOINT}/api/v1/config/timing/${service}/${parsed_date}`,
  //   //     {
  //   //       method: "DELETE",
  //   //       headers: {
  //   //         Authorization: `Bearer ${token}`,
  //   //         "Content-Type": "application/json",
  //   //       },
  //   //       body: JSON.stringify({
  //   //         min: lower_time.value,
  //   //         max: upper_time.value,
  //   //       }),
  //   //     }
  //   //   );
  //   //   if (response.status === 201) {
  //   //   }
  //   // } catch (error) {
  //   //   console.error(error);
  //   // }
  // };

  // const addBlockedOffIntervalForService = async (service) => {
  //   try {
  //     const token = await getAccessTokenSilently();
  //     const response = await fetch(
  //       `${ENDPOINT}/api/v1/config/timing/${service}/${parsed_date}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           min: lower_time.value,
  //           max: upper_time.value,
  //         }),
  //       }
  //     );
  //     if (response.status === 201) {
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const onChangeServiceSelection = (e, i) => {
    e.preventDefault();
    const new_service_selection = service_selection.slice();
    new_service_selection[i] = !new_service_selection[i];
    setServiceSelection(new_service_selection);
    if (selected_date && !HasOptionsForDate(selected_date)) {
      setDate(null);
    }
  }

  const onChangeLowerBound = e => {
    let new_upper;
    if (upper_time) {
      new_upper = upper_time.value < e.value ? e : upper_time;
    }
    else {
      new_upper = e;
    }
    if (!e) {
      new_upper = null;
    }
    setCanSubmit(e && new_upper && selected_date);
    setLowerTime(e);
    setUpperTime(new_upper);
  }
  const onChangeUpperBound = e => {
    setCanSubmit(e && lower_time && selected_date);
    setUpperTime(e);
  }
  const setDate = date => {
    setSelectedDate(date);
    setParsedDate(date ?
        format(date, WDateUtils.DATE_STRING_INTERNAL_FORMAT) :
        "");
    setLowerTime(null);
    setUpperTime(null);
    setCanSubmit(false);
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (selected_date) {
      const interval = [lower_time.value, upper_time.value];
      addBlockedOffInterval(parsed_date, interval, service_selection);
      if (!HasOptionsForDate(selected_date)) {
        setDate(null);
      }
      else {
        setLowerTime(null);
        setUpperTime(null);
      }
    }
  }


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (can_submit) {
  //     setCanSubmit(false);
  //     if (selected_date) {
  //       var promises = [];
  //       for (var service_index in service_selection) {
  //         if (service_selection[service_index]) {
  //           promises.push(addBlockedOffIntervalForService(service_index));
  //         }
  //       }
  //       await Promise.all(promises);
  //       if (!HasOptionsForDate(selected_date)) {
  //         setDate(null);
  //       }
  //       else {
  //         setLowerTime(null);
  //         setUpperTime(null);
  //       }
  //     }
  //     setCanSubmit(true);
  //   }
  // }

  const services_checkboxes = SERVICES.map((x, i) => (
      <Grid item xs={Math.floor(12/SERVICES.length)} key={i}>
        <ServiceSelectionCheckbox
          service_name={x}
          selected={service_selection[i]}
          onChange={(e) => onChangeServiceSelection(e, i)}
        />
      </Grid>
    ));
  const blocked_off_html = BLOCKED_OFF ? BLOCKED_OFF.map((service, i) => {
    const blocked_off_days_html = BLOCKED_OFF[i].map((blocked_off_for_day, j) => {
      const blocked_off_intervals_html = BLOCKED_OFF[i][j][1].map((interval, k) => {
        const from_to = BLOCKED_OFF[i][j][1][k][0] === BLOCKED_OFF[i][j][1][k][1] ? WDateUtils.MinutesToPrintTime(BLOCKED_OFF[i][j][1][k][0]) : `${WDateUtils.MinutesToPrintTime(BLOCKED_OFF[i][j][1][k][0])} to ${WDateUtils.MinutesToPrintTime(BLOCKED_OFF[i][j][1][k][1])}`;
        return (
          <ListItem key={k}>
            <ListItemText primary={from_to} />
            <ListItemSecondaryAction>
              <IconButton edge="end" size="small" disabled={isProcessing} aria-label="delete" onClick={() => removeBlockedOffInterval(i,j,k)}>
                <HighlightOff />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })
      return (
        <Container key={j}>
          <ListItem>
            {format(parse(BLOCKED_OFF[i][j][0], WDateUtils.DATE_STRING_INTERNAL_FORMAT, new Date()), 'EEEE, MMMM dd, y')}
            <ListItemSecondaryAction>
              <IconButton edge="end" size="small" disabled={isProcessing} aria-label="delete" onClick={() => removeBlockedOffForDate(i,j)}>
                <HighlightOff />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <List sx={{ml: 2}}>
            {blocked_off_intervals_html}
          </List>
        </Container>
      );
    })
    return (
      <Grid key={i} item xs={Math.floor(12/SERVICES.length)}>
        <Card>
          <CardHeader title={SERVICES[i]} />
            <List component="nav">
              {blocked_off_days_html}
            </List>
        </Card>
      </Grid>
    );
  }) : "";
  const start_options = selected_date ?
    WDateUtils.GetOptionsForDate(
      WDateUtils.GetInfoMapForAvailabilityComputation(BLOCKED_OFF, SETTINGS, LEAD_TIME, selected_date, service_selection, {}), 
      selected_date,
      new Date()) : [];
  const end_options = start_options.length && lower_time ?
    TrimOptionsBeforeDisabled(start_options.filter(x => x.value >= lower_time.value)) : [];
  return (
    <>
    <Grid item xs={12}>
      <Card>
        <CardHeader title="Add Blocked-Off Time:" sx={{ mb: 3 }} />
        <Grid container justifyContent="center">
          <Grid item xs={8}>
            <Grid sx={{ml:6}} container>{services_checkboxes}</Grid>
          </Grid>
          <Grid item xs={4}>
            <MobileDatePicker
              renderInput={(props) => <TextField {...props} />}
              fullWidth
              closeOnSelect
              placeholder={"Select Date"}
              showToolbar={false}
              minDate={new Date()}
              maxDate={add(new Date(), {days: 60})}
              shouldDisableDate={e => !HasOptionsForDate(e)}
              value={selected_date}
              onChange={date => setDate(date)}
              inputFormat="EEEE, MMMM dd, y"
            />
          </Grid>
          <Grid item xs={5}>
            <TimeSelection
            sx={{m:2}}
            onChange={(e, nv) => onChangeLowerBound(nv)}
            value={lower_time}
            optionCaption={"Start"}
            options={start_options.filter((elt) => !elt.disabled).map(x=>({...x, label: WDateUtils.MinutesToPrintTime(x.value)}))}
            disabled={!selected_date}
            className="col"
            />
          </Grid>
          <Grid item xs={5}>
            <TimeSelection
            sx={{m:2}}
            onChange={(e, nv) => onChangeUpperBound(nv)}
            value={upper_time}
            optionCaption={"End"}
            options={end_options.map(x=>({...x, label: WDateUtils.MinutesToPrintTime(x.value)}))}
            disabled={!(selected_date && lower_time)}
            className="col"
            />
          </Grid>
          <Grid item xs={2}><Button sx={{m:3}} onClick={handleSubmit} disabled={!can_submit || isProcessing}>Add</Button></Grid>
        </Grid>
      </Card>
      </Grid>
      { blocked_off_html }
      </>
  );
}

export default BlockOffComp;