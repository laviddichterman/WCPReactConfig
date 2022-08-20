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
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useAuth0 } from '@auth0/auth0-react';
import { GetNextAvailableServiceDate, IWInterval, PostBlockedOffToFulfillmentsRequest, WDateUtils } from "@wcp/wcpshared";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { HOST_API } from '../../config';
import { setSelectedDate, setStartTime, setEndTime, toggleSelectedService, setSelectedServices } from "../../redux/slices/BlockOffSlice";


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
  const CURRENT_TIME = useAppSelector(s => s.metrics.currentTime);
  const NUM_SERVICES = useMemo(() => Object.keys(fulfillments).length, [fulfillments]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const startTime = useAppSelector(s => s.blockOff.startTime);
  const endTime = useAppSelector(s => s.blockOff.endTime);
  const selectedDate = useAppSelector(s => s.blockOff.selectedDate);
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
  const startOptions = useMemo(() => {
    return selectedDate !== null ? GetOptionsForDate(selectedDate) : []
  }, [selectedDate, GetOptionsForDate]);
  const endOptions = useMemo(() => {
    return selectedDate !== null && startTime !== null ?
      TrimOptionsBeforeDisabled(startOptions.filter(x => x.value >= startTime)) : [];
  }, [selectedDate, startTime, startOptions]);
  useEffect(() => {
    if (selectedDate === null) {
      // get next available date and time
      const next = GetNextAvailableServiceDate(selectedServices.map(x => fulfillments[x]), 1, formatISO(CURRENT_TIME))
      if (next !== null) {
        dispatch(setSelectedDate(next[0]));
        dispatch(setStartTime(next[1]));
        dispatch(setEndTime(next[1]));
      }
    }
  }, [selectedDate, fulfillments, selectedServices, CURRENT_TIME, dispatch]);

  useEffect(() => {
    if (selectedServices.length === 0 && Object.keys(fulfillments).length > 0) {
      dispatch(setSelectedServices(Object.keys(fulfillments)));
    }
  }, [selectedServices, fulfillments, dispatch]);

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
          dispatch(setStartTime(null))
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
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Add Blocked-Off Time:" sx={{ mb: 3 }} />
          <Grid container justifyContent="center">
            <Grid item container xs={8} sx={{ ml: 6 }}>
              {
                Object.values(fulfillments).map((x) => (
                  <Grid item xs={Math.floor(12 / NUM_SERVICES)} key={x.id}>
                    <ServiceSelectionCheckbox
                      service_name={x.displayName}
                      selected={selectedServices.indexOf(x.id) !== -1}
                      onChange={() => onChangeServiceSelection(x.id)}
                    />
                  </Grid>
                ))
              }
            </Grid>
            <Grid item xs={4}>
              <MobileDatePicker
                renderInput={(props) => <TextField {...props} />}
                closeOnSelect
                showToolbar={false}
                minDate={new Date(CURRENT_TIME)}
                maxDate={add(CURRENT_TIME, { days: 60 })}
                shouldDisableDate={e => !HasOptionsForDate(WDateUtils.formatISODate(e))}
                value={selectedDate ? parseISO(selectedDate) : null}
                onChange={(date) => handleSetSelectedDate(date)}
                inputFormat={WDateUtils.ServiceDateDisplayFormat}
              />
            </Grid>
            <Grid item xs={5}>
              <Autocomplete
                sx={{ m: 2 }}
                disableClearable
                className="col"
                options={startOptions.filter(x => !x.disabled).map(x => x.value)}
                isOptionEqualToValue={(o, v) => o === v}
                getOptionLabel={x => WDateUtils.MinutesToPrintTime(x)}
                // @ts-ignore
                value={startTime}
                onChange={(_, v) => onChangeLowerBound(v)}
                disabled={selectedDate === null}
                renderInput={(params) => <TextField {...params} label={"Start"}
                />}
              />
            </Grid>
            <Grid item xs={5}>
              <Autocomplete
                sx={{ m: 2 }}
                disableClearable
                className="col"
                options={endOptions.filter(x => !x.disabled).map(x => x.value)}
                isOptionEqualToValue={(o, v) => o === v}
                getOptionLabel={x => WDateUtils.MinutesToPrintTime(x)}
                // @ts-ignore
                value={endTime}
                onChange={(_, v) => onChangeUpperBound(v)}
                disabled={selectedDate === null || startTime === null}
                renderInput={(params) => <TextField {...params} label={"End"}
                />}
              />
            </Grid>
            <Grid item xs={2}><Button sx={{ m: 3 }} onClick={() => postBlockedOff()} disabled={!canPostBlockedOff || isProcessing}>Add</Button></Grid>
          </Grid>
        </Card>
      </Grid>
      {Object.values(fulfillments).map(fulfillment =>
        <Grid key={fulfillment.id} item xs={Math.floor(12 / NUM_SERVICES)}>
          <Card>
            <CardHeader title={fulfillment.displayName} />
            <List component="nav">
              {Object.entries(fulfillment.blockedOff).map(([isoDate, intervals]) => (
                <Container key={`${fulfillment.id}.${isoDate}`}>
                  <ListItem>
                    {format(parseISO(isoDate), WDateUtils.ServiceDateDisplayFormat)}
                    <ListItemSecondaryAction>
                      <IconButton hidden={intervals.length === 0} edge="end" size="small" disabled={isProcessing} aria-label="delete" onClick={() => removeBlockedOffForDate(fulfillment.id, isoDate)}>
                        <HighlightOff />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <List sx={{ ml: 2 }}>
                    {intervals.map((interval, i) => {
                      const from_to = interval.start === interval.end ? WDateUtils.MinutesToPrintTime(interval.start) : `${WDateUtils.MinutesToPrintTime(interval.start)} to ${WDateUtils.MinutesToPrintTime(interval.end)}`;
                      return (
                        <ListItem key={i}>
                          <ListItemText primary={from_to} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" size="small" disabled={isProcessing} aria-label="delete" onClick={() => removeBlockedOffInterval(fulfillment.id, isoDate, interval)}>
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
    </>
  );
}

export default BlockOffComp;