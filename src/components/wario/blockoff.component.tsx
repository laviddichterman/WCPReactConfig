import React, { useState, useMemo, useCallback, useEffect } from "react";
import { add, format, formatISO, parseISO } from "date-fns";
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
import { StaticDatePicker } from '@mui/x-date-pickers';
import { useAuth0 } from '@auth0/auth0-react';
import { GetNextAvailableServiceDate, IWInterval, PostBlockedOffToFulfillmentsRequest, WDateUtils } from "@wcp/wcpshared";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { HOST_API } from '../../config';
import { setSelectedDate, setStartTime, setEndTime, toggleSelectedService, setSelectedServices, setStartOptions, setEndOptions } from "../../redux/slices/BlockOffSlice";

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
  const dispatch = useAppDispatch();
  const fulfillments = useAppSelector(s => s.ws.fulfillments!);
  const filteredFulfillments = useMemo(() => Object.values(fulfillments).filter((x) => WDateUtils.HasOperatingHours(x.operatingHours)), [fulfillments])
  const CURRENT_TIME = useAppSelector(s => s.ws.currentTime);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const startTime = useAppSelector(s => s.blockOff.startTime);
  const endTime = useAppSelector(s => s.blockOff.endTime);
  const selectedDate = useAppSelector(s => s.blockOff.selectedDate);
  const startOptions = useAppSelector(s=>s.blockOff.startOptions);
  const endOptions = useAppSelector(s=>s.blockOff.endOptions);
  const selectedServices = useAppSelector(s => s.blockOff.selectedServices);

  const canPostBlockedOff = useMemo(() => selectedDate !== null && startTime !== null && endTime !== null, [selectedDate, startTime, endTime]);

  const GetOptionsForDate = useCallback((isoDate: string) => {
    if (selectedServices.length > 0) {
      const INFO = WDateUtils.GetInfoMapForAvailabilityComputation(selectedServices.map(x => fulfillments[x]), isoDate, { cart_based_lead_time: 0, size: 1 });
      return WDateUtils.GetOptionsForDate(INFO, isoDate, formatISO(CURRENT_TIME));
    }
    return [];
  }, [selectedServices, fulfillments, CURRENT_TIME]);
  const HasOptionsForDate = useCallback((isoDate: string) => GetOptionsForDate(isoDate).filter(x => !x.disabled).length, [GetOptionsForDate]);

  useEffect(() => {
    let starts = selectedDate !== null ? GetOptionsForDate(selectedDate) : [];
    if (starts.length === 0) {
        // go to find next available
        const next = GetNextAvailableServiceDate(selectedServices.map(x => fulfillments[x]), 1, formatISO(CURRENT_TIME))
        if (next !== null) {
          const newSelectedDate = next[0];
          const newStart = next[1];
          const newStarts = GetOptionsForDate(newSelectedDate);
          const newEnds = TrimOptionsBeforeDisabled(newStarts.filter(x => x.value >= newStart))
          dispatch(setStartOptions(newStarts));
          dispatch(setEndOptions(newEnds));
          dispatch(setSelectedDate(newSelectedDate));
          dispatch(setStartTime(newStart));
          dispatch(setEndTime(newStart));
        }
        // this shouldn't happen
        return;
    } else { // effectively selectedDate !== null AND starts.length > 0
      // if startTime is not valid
      if (startTime === null || starts.findIndex(x=>x.value === startTime) === -1) {
        // we need a new start time, set it to the first option.
        // in this case, endOptions will be the set to starts
        const newStart = starts[0].value;
        dispatch(setStartTime(newStart));
        if (endTime === null || starts.findIndex(x=>x.value === endTime) === -1) {
          // and endTime will be set to newStart if its previous value is no longer good
          dispatch(setEndTime(newStart));
          dispatch(setEndOptions(starts));
        } 
      } else {
        // start time is good! and is potentially not the first option
        // just need to recompute ends and verify the end time
        const newEnds = TrimOptionsBeforeDisabled(starts.filter(x => x.value >= startTime))
        if (endTime === null || newEnds.findIndex(x=>x.value === endTime) === -1) {
          dispatch(setEndTime(newEnds[0].value));
        }
        dispatch(setEndOptions(newEnds));
        dispatch(setStartOptions(starts));
      }
    }
  }, [startTime, endTime, selectedDate, selectedServices, fulfillments, CURRENT_TIME, GetOptionsForDate]);

  useEffect(() => {
    if (selectedServices.length === 0 && filteredFulfillments.length > 0) {
      dispatch(setSelectedServices(filteredFulfillments.map(x=>x.id)));
    }
  }, [selectedServices, filteredFulfillments]);
  useEffect(() => {
    if (startTime === null || !startOptions.find(x => x.value === startTime)) {
      if (startOptions.length > 0) {
        dispatch(setStartTime(startOptions[0].value));
      }
    }
  }, [startTime, startOptions]);

  useEffect(() => {
    if (endTime === null || !endOptions.find(x => x.value === endTime)) {
      if (endOptions.length > 0) {
        dispatch(setEndTime(endOptions[0].value));
      }
    }
  }, [startTime, endTime, endOptions]);
  const postBlockedOff = async () => {
    if (!isProcessing && selectedDate !== null && startTime !== null && endTime !== null) {
      try {
        const token = await getAccessTokenSilently({ scope: "write:order_config" });
        const body: PostBlockedOffToFulfillmentsRequest = {
          date: selectedDate,
          fulfillmentIds: selectedServices,
          interval: {
            start: startTime,
            end: endTime
          }
        };
        const response = await fetch(
          `${HOST_API}/api/v1/config/timing/blockoff`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
        if (response.status === 201) {
          dispatch(setStartTime(null));
          dispatch(setEndTime(null));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteBlockedOff = async (fulfillmentId: string, isoDate: string, interval: IWInterval) => {
    try {
      const token = await getAccessTokenSilently({ scope: "write:order_config" });
      const body: PostBlockedOffToFulfillmentsRequest = {
        date: isoDate,
        fulfillmentIds: [fulfillmentId],
        interval: interval
      };
      const response = await fetch(
        `${HOST_API}/api/v1/config/timing/blockoff`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (response.status === 201) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeBlockedOffForDate = async (fulfillmentId: string, isoDate: string) => {
    if (!isProcessing) {
      setIsProcessing(true);
      await deleteBlockedOff(fulfillmentId, isoDate, { start: 0, end: 1440 });
      setIsProcessing(false);
    }
  }

  const removeBlockedOffInterval = async (fulfillmentId: string, isoDate: string, interval: IWInterval) => {
    if (!isProcessing) {
      setIsProcessing(true);
      await deleteBlockedOff(fulfillmentId, isoDate, interval);
      setIsProcessing(false);
    }
  }

  const onChangeServiceSelection = (fulfillmentId: string) => {
    dispatch(toggleSelectedService(fulfillmentId));
  }

  const onChangeLowerBound = (e: number) => {
    dispatch(setStartTime(e));
  }
  const onChangeUpperBound = (e: number) => {
    dispatch(setEndTime(e));
  }
  const handleSetSelectedDate = (date: Date | null) => {
    if (date) {
      const isoDate = WDateUtils.formatISODate(date);
      dispatch(setSelectedDate(isoDate));
    } else {
      dispatch(setSelectedDate(null));
    }
  }

  return (
    filteredFulfillments.length === 0 ? <div>Fulfillments need operating hours for this page to be useful</div> :
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Add Blocked-Off Time:" sx={{ mb: 3 }} />
          <Grid container>
            <Grid item container xs={12} sx={{ mx: 6 }}>
              {
                filteredFulfillments.map((x) => (
                  <Grid item xs={Math.floor(12 / filteredFulfillments.length)} key={x.id}>
                    <ServiceSelectionCheckbox
                      service_name={x.displayName}
                      selected={selectedServices.indexOf(x.id) !== -1}
                      onChange={() => onChangeServiceSelection(x.id)}
                    />
                  </Grid>
                ))
              }
            </Grid>
            <Grid item xs={12} sm={7} >
              <StaticDatePicker
                renderInput={(props) => <TextField {...props} />}
                displayStaticWrapperAs="desktop"
                openTo="day"
                showToolbar={false}
                minDate={new Date(CURRENT_TIME)}
                maxDate={add(CURRENT_TIME, { days: 60 })}
                shouldDisableDate={e => !HasOptionsForDate(WDateUtils.formatISODate(e))}
                value={selectedDate ? parseISO(selectedDate) : null}
                onChange={(date) => handleSetSelectedDate(date)}
                inputFormat={WDateUtils.ServiceDateDisplayFormat}
              />
            </Grid>
            <Grid container spacing={2} sx={{ my: 'auto', px: 1, pb: 1 }} item xs={12} sm={5}>
              <Grid item xs={5} sm={12} sx={{ py: 2, mx: 'auto', alignContent: "center" }}>
                <Autocomplete
                  sx={{ m: 'auto', maxWidth: 200 }}
                  disableClearable
                  className="col"
                  options={startOptions.filter(x => !x.disabled).map(x => x.value)}
                  isOptionEqualToValue={(o, v) => o === v}
                  getOptionLabel={x => x !== null ? WDateUtils.MinutesToPrintTime(x) : ""}
                  // @ts-ignore
                  value={startTime}
                  onChange={(_, v) => onChangeLowerBound(v)}
                  disabled={selectedDate === null}
                  renderInput={(params) => <TextField {...params} label={"Start"}
                  />}
                />
              </Grid>
              <Grid item xs={5} sm={12} sx={{ py: 2, mx: 'auto', alignContent: "center" }}>
                <Autocomplete
                  sx={{ m: 'auto', maxWidth: 200 }}
                  disableClearable
                  className="col"
                  options={endOptions.filter(x => !x.disabled).map(x => x.value)}
                  isOptionEqualToValue={(o, v) => o === v}
                  getOptionLabel={x => x !== null ? WDateUtils.MinutesToPrintTime(x) : ""}
                  // @ts-ignore
                  value={endTime}
                  onChange={(_, v) => onChangeUpperBound(v)}
                  disabled={selectedDate === null || startTime === null}
                  renderInput={(params) => <TextField  {...params} label={"End"}
                  />}
                />
              </Grid>
              <Grid item xs={2} sm={12} sx={{ mx: 'auto', py: 2, alignContent: "center" }}>
                <Button sx={{ m: 'auto', width: '100%', height: '100%' }} onClick={() => postBlockedOff()} disabled={!canPostBlockedOff || isProcessing}>
                  Add
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item container sx={{py:3}} spacing={3}>
      {filteredFulfillments.filter(x=>x.blockedOff.length > 0).map((fulfillment, _, arr) =>
        <Grid key={fulfillment.id} sx={{mx: 'auto'}} item xs={12} md={Math.min(Math.max(Math.floor(12 / arr.length), 6), 6)} lg={Math.min(Math.max(Math.floor(12 / arr.length), 4), 4)}>
          <Card>
            <CardHeader title={`${fulfillment.displayName} Blocked-Off Intervals`} />
            <List component="nav">
              { /* Note: the blocked off array should be pre-sorted */ }
              {fulfillment.blockedOff.map((entry) => (
                <Container key={`${fulfillment.id}.${entry.key}`}>
                  <ListItem>
                    {format(parseISO(entry.key), WDateUtils.ServiceDateDisplayFormat)}
                    <ListItemSecondaryAction>
                      <IconButton hidden={entry.value.length === 0} edge="end" size="small" disabled={isProcessing} aria-label="delete" onClick={() => removeBlockedOffForDate(fulfillment.id, entry.key)}>
                        <HighlightOff />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <List sx={{ ml: 2 }}>
                    {entry.value.map((interval, i) => {
                      const from_to = interval.start === interval.end ? WDateUtils.MinutesToPrintTime(interval.start) : `${WDateUtils.MinutesToPrintTime(interval.start)} to ${WDateUtils.MinutesToPrintTime(interval.end)}`;
                      return (
                        <ListItem key={i}>
                          <ListItemText primary={from_to} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" size="small" disabled={isProcessing} aria-label="delete" onClick={() => removeBlockedOffInterval(fulfillment.id, entry.key, interval)}>
                              <HighlightOff />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                </Container>
              ))}
            </List>
          </Card>
        </Grid>)}
        </Grid>
    </>
  );
}

export default BlockOffComp;