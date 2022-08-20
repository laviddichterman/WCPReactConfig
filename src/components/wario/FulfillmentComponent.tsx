import React, { useMemo, useState } from 'react';
import { HighlightOff } from '@mui/icons-material';

import type { Polygon } from 'geojson';

import {
  Grid,
  TextField,
  Card,
  IconButton,
  Autocomplete,
  Button,
  CardHeader
} from '@mui/material';
import { ElementActionComponent } from './menu/element.action.component';
import { DayOfTheWeek, FulfillmentType, IWInterval, OperatingHourSpecification, WDateUtils } from '@wcp/wcpshared';
import { useAppSelector } from '../../hooks/useRedux';
import { CheckedNumericInput } from './CheckedNumericTextInput';
import { ValSetValNamed } from '../../utils/common';
import { StringPropertyComponent } from './property-components/StringPropertyComponent';
import { IntNumericPropertyComponent } from './property-components/IntNumericPropertyComponent';
import { ToggleBooleanPropertyComponent } from './property-components/ToggleBooleanPropertyComponent';
import { StringEnumPropertyComponent } from './property-components/StringEnumPropertyComponent';
import { format, setDay } from 'date-fns';


export interface OperatingHoursIntervalFormProps {
  timeStep: number;
  disabled: boolean;
  onAddInterval: (interval: IWInterval) => void;
};

const OperatingHoursIntervalForm = ({
  timeStep,
  disabled,
  onAddInterval
}: OperatingHoursIntervalFormProps) => {
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const onSubmitHandler = () => {
    if (start !== null && end !== null) {
      onAddInterval({ start, end });
    }
    setStart(null);
    setEnd(null);
  }
  const startOptions = useMemo(() => {
    let earliest = 0;
    const latest = 1440 - timeStep;
    const retval = [];
    while (earliest <= latest) {
      retval.push(earliest);
      earliest += timeStep;
    }
    return retval;
  }, [timeStep]);

  const endOptions = useMemo(() => start !== null ?
    startOptions.filter(x => x >= start) : [], [start, startOptions]);

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={5}>
        <Autocomplete
          disableClearable
          options={startOptions}
          isOptionEqualToValue={(o, v) => o === v}
          getOptionLabel={x => WDateUtils.MinutesToPrintTime(x)}
          // @ts-ignore
          value={start}
          size='small'
          onChange={(_, v) => setStart(v)}
          renderInput={(params) => <TextField {...params} label={"Start"}
          />}
        />
      </Grid>
      <Grid item xs={5}>
        <Autocomplete
          disableClearable
          options={endOptions}
          isOptionEqualToValue={(o, v) => o === v}
          getOptionLabel={x => WDateUtils.MinutesToPrintTime(x)}
          // @ts-ignore
          value={end}
          size='small'
          disabled={start === null || disabled}
          onChange={(_, v) => setEnd(v)}
          renderInput={(params) => <TextField {...params} label={"End"}
          />}
        />
      </Grid>
      <Grid item xs={2}>
        <Button
          disabled={start === null || end === null || disabled}
          onClick={() => onSubmitHandler()}>Add</Button>
      </Grid>
    </Grid>
  );
}

type IntervalsComponentBaseProps = {
  label: string;
  disabled: boolean;
  timeStep: number;
}

const OperatingHoursComponent = function (props: IntervalsComponentBaseProps & ValSetValNamed<OperatingHourSpecification, 'operatingHours'>) {
  function onAddOperatingHours(day: DayOfTheWeek, interval: IWInterval) {
    props.setOperatingHours(WDateUtils.AddIntervalToOperatingHours(
      day,
      interval,
      props.operatingHours))
  };
  function onRemoveOperatingHours(day: DayOfTheWeek, interval: IWInterval) {
    props.setOperatingHours({...props.operatingHours, [day]: WDateUtils.ComputeSubtractionOfIntervalSets(props.operatingHours[day], [interval], props.timeStep)});
  };
  return (
    <Card sx={{ p: 3 }}>
      <CardHeader title={props.label} />
      <Grid container>
        {Object.keys(props.operatingHours).map((_, day: DayOfTheWeek) =>
          <Grid container item xs={12} key={day}>
            <Grid item xs={1}>
              {format(setDay(Date.now(), day), 'EEEE')}:    
            </Grid>
            {props.operatingHours[day].map((interval, j) => (
              <Grid item xs={2} container key={j}>
                <Grid item xs={10}>
                  {WDateUtils.MinutesToPrintTime(interval.start)}
                  &nbsp;-&nbsp;
                  {WDateUtils.MinutesToPrintTime(interval.end)}
                </Grid>
                <Grid item xs={2}>
                  <IconButton edge="end" size="small" aria-label="delete" onClick={() => onRemoveOperatingHours(day, interval)}>
                    <HighlightOff />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Grid item xs />
            <Grid item xs={4}>
              <OperatingHoursIntervalForm
                disabled={props.disabled}
                onAddInterval={(i) => onAddOperatingHours(day, i)}
                timeStep={props.timeStep}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Card >
  )
}

const DateIntervalsComponent = function (props: IntervalsComponentBaseProps & ValSetValNamed<Record<string | number | symbol, IWInterval[]>, 'dateIntervals'>) {

}

export type FulfillmentComponentProps =
  ValSetValNamed<string, 'shortcode'> &
  ValSetValNamed<string, 'displayName'> &
  ValSetValNamed<number, 'ordinal'> &
  ValSetValNamed<FulfillmentType, 'service'> &
  ValSetValNamed<string[], 'terms'> &
  ValSetValNamed<string, 'confirmationMessage'> &
  ValSetValNamed<string, 'instructions'> &
  ValSetValNamed<string|null, 'menuCategoryId'> &
  ValSetValNamed<string|null, 'orderCategoryId'> &
  ValSetValNamed<boolean, 'requirePrepayment'> &
  ValSetValNamed<boolean, 'allowPrepayment'> &
  ValSetValNamed<{ function: string, percentage: number } | null, 'autograt'> &
  ValSetValNamed<string | null, 'serviceChargeFunctionId'> &
  ValSetValNamed<number, 'leadTime'> &
  ValSetValNamed<OperatingHourSpecification, 'operatingHours'> &
  ValSetValNamed<Record<string, IWInterval[]>, 'specialHours'> &
  ValSetValNamed<Record<string, IWInterval[]>, 'blockedOff'> &
  ValSetValNamed<number, 'minDuration'> &
  ValSetValNamed<number, 'maxDuration'> &
  ValSetValNamed<number, 'timeStep'> &
  ValSetValNamed<number | null, 'maxGuests'> &
  ValSetValNamed<Polygon | null, 'serviceArea'> &
  {
    onCloseCallback: React.MouseEventHandler<HTMLButtonElement>;
    onConfirmClick: React.MouseEventHandler<HTMLButtonElement>;
    isProcessing: boolean;
    disableConfirmOn: boolean;
    confirmText: string;
  };

const FulfillmentComponent = (props: FulfillmentComponentProps) => {
  const catalog = useAppSelector(s => s.ws.catalog!);
  const [isServiceAreaDirty, setIsServiceAreaDirty] = useState(false);
  const [isServiceAreaParsingError, setIsServiceAreaParsingError] = useState(false);
  const [localServiceAreaString, setLocalServiceAreaString] = useState(props.serviceArea ? JSON.stringify(props.serviceArea) : null)
  function onSetServiceArea(json: string | null) {
    try {
      props.setServiceArea(json ? JSON.parse(json) : null);
      setIsServiceAreaParsingError(false);
    }
    catch (e) {
      setIsServiceAreaParsingError(true);
    }
  }
  const onChangeLocalServiceAreaString = (val: string) => {
    setIsServiceAreaDirty(true);
    setLocalServiceAreaString(val);
  }
  return (
    <ElementActionComponent
      onCloseCallback={props.onCloseCallback}
      onConfirmClick={props.onConfirmClick}
      isProcessing={props.isProcessing}
      disableConfirmOn={props.disableConfirmOn}
      confirmText={props.confirmText}
      body={
        <>
          <Grid item xs={12} >
            <StringEnumPropertyComponent
              disabled={props.isProcessing}
              label="Fulfillment Type"
              value={props.service}
              setValue={props.setService}
              options={Object.keys(FulfillmentType)}
            />
          </Grid>
          <Grid item xs={2}>
            <StringPropertyComponent
              disabled={props.isProcessing}
              label="Short Code"
              value={props.shortcode}
              setValue={props.setShortcode}
            />
          </Grid>

          <Grid item xs={4}>
            <StringPropertyComponent
              disabled={props.isProcessing}
              label="Display Name"
              value={props.displayName}
              setValue={props.setDisplayName}
            />
          </Grid>
          <Grid item xs={2}>
            <IntNumericPropertyComponent
              disabled={props.isProcessing}
              label="Ordinal"
              value={props.ordinal}
              setValue={props.setOrdinal}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              fullWidth
              label="Service Terms (Each line a new bullet point)"
              type="text"
              value={props.terms.join('\n')}
              size="small"
              onChange={(e) => props.setTerms(e.target.value.trim().split('\n'))}
            />
          </Grid>
          <Grid item xs={4}>
            <StringPropertyComponent
              disabled={props.isProcessing}
              label="Order Confirmation Message"
              value={props.confirmationMessage}
              setValue={props.setConfirmationMessage}
            />
          </Grid>
          <Grid item xs={4}>
            <StringPropertyComponent
              disabled={props.isProcessing}
              label="Order Instructions Message"
              value={props.instructions}
              setValue={props.setInstructions}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              unselectable='off'
              disableClearable
              filterSelectedOptions
              disabled={props.isProcessing}
              options={Object.keys(catalog.categories)}
              // @ts-ignore
              value={props.menuCategoryId}
              onChange={(_, v) => v && props.setMenuCategoryId(v)}
              getOptionLabel={(option) => catalog.categories[option].category.name}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Menu Category" />}
            />
          </Grid>

          <Grid item xs={6}>
            <Autocomplete
              unselectable='off'
              disableClearable
              filterSelectedOptions
              disabled={props.isProcessing}
              options={Object.keys(catalog.categories)}
              // @ts-ignore
              value={props.orderCategoryId}
              onChange={(_, v) => v && props.setOrderCategoryId(v)}
              getOptionLabel={(option) => catalog.categories[option].category.name}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Order Category" />}
            />
          </Grid>
          <Grid item xs={4}>
            <ToggleBooleanPropertyComponent
              disabled={props.isProcessing}
              label="Allow Pre-Payment"
              value={props.allowPrepayment}
              setValue={props.setAllowPrepayment}
              labelPlacement='end'
            />
          </Grid>
          <Grid item xs={4}>
            <ToggleBooleanPropertyComponent
              disabled={props.isProcessing || !props.allowPrepayment}
              label="Require Pre-Payment"
              value={props.allowPrepayment && props.requirePrepayment}
              setValue={props.setRequirePrepayment}
              labelPlacement='end'
            />
          </Grid>
          {/* //ValSetValNamed<{ function: string, percentage: number } | null, 'autograt'> & */}
          <Grid item xs={6}>
            <Autocomplete
              style={{ width: 300 }}
              options={Object.keys(catalog.orderInstanceFunctions)}
              value={props.serviceChargeFunctionId}
              onChange={(e, v) => props.setServiceChargeFunctionId(v)}
              getOptionLabel={(option) => catalog.orderInstanceFunctions[option].name ?? "CORRUPT DATA"}
              isOptionEqualToValue={(o, v) => o === v}
              renderInput={(params) => <TextField {...params} label="Service Charge Function" />}
            />
          </Grid>
          <Grid item xs={12}>
            <OperatingHoursComponent
              disabled={props.isProcessing}
              label='Operating Hours'
              operatingHours={props.operatingHours}
              setOperatingHours={props.setOperatingHours}
              timeStep={props.timeStep} />
          </Grid>
          <Grid item xs={2}>
            <IntNumericPropertyComponent
              disabled={props.isProcessing}
              label="Lead Time"
              value={props.leadTime}
              setValue={props.setLeadTime}
            />
          </Grid>
          <Grid item xs={2}>
            <IntNumericPropertyComponent
              disabled={props.isProcessing}
              label="Min Duration"
              max={props.maxDuration}
              value={props.minDuration}
              setValue={props.setMinDuration}
            />
          </Grid>
          <Grid item xs={2}>
            <IntNumericPropertyComponent
              disabled={props.isProcessing}
              label="Max Duration"
              min={props.minDuration}
              value={props.maxDuration}
              setValue={props.setMaxDuration}
            />
          </Grid>
          <Grid item xs={2}>
            <IntNumericPropertyComponent
              disabled={props.isProcessing}
              min={1}
              max={1440}
              label="Time Step"
              value={props.timeStep}
              setValue={props.setTimeStep}
            />
          </Grid>
          <Grid item xs={4}>
            <CheckedNumericInput
              label="Max Guests"
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0, pattern: '[0-9]*', step: 1 }}
              disabled={props.isProcessing}
              value={props.maxGuests}
              onChange={(e) => props.setMaxGuests(e)}
              parseFunction={(v) => v !== null && v ? parseInt(v) : null}
              allowEmpty={true} />
          </Grid>
          <Grid item xs={12}>
          <TextField
            aria-label="textarea"
            rows={15}
            fullWidth
            multiline
            value={JSON.stringify(props.serviceArea)}
            onChange={e => onChangeLocalServiceAreaString(e.target.value)}
            onBlur={() => onSetServiceArea(localServiceAreaString)}
            error={isServiceAreaParsingError}
            helperText={isServiceAreaParsingError ? "JSON Parsing Error" : ""}
          />
        </Grid>
          {/* //ValSetValNamed<Polygon | null, 'serviceArea'> & */}


        </>
      }
      />);
};

export default FulfillmentComponent;
