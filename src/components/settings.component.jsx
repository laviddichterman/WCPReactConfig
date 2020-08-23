import React, { useState } from 'react';
import Moment from 'react-moment';
import memoizeOne from 'memoize-one';

import TimeSelection from "./timepicker.component";
import CheckedInputComponent from "./checked_input.component";

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';

import { WDateUtils } from "@wcp/wcpshared";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    flexGrow: 1,
  }
}));

const OperatingHoursIntervalForm = ({
  settings, 
  interval, 
  onChangeLowerBound, 
  onChangeUpperBound,
  disabled,
  onAddOperatingHours
}) => {
  const generateOptions = (earliest, latest, step) => {
    var retval = [];
    while (earliest <= latest) {
      retval.push({ value: earliest, label: WDateUtils.MinutesToPrintTime(earliest)});
      earliest += step;
    }
    return retval;
  }
  const memoizedGenerateOptions = memoizeOne(generateOptions);
  const start_options = memoizedGenerateOptions(0, 1440-settings.time_step, settings.time_step);
  const end_options = interval.start ?
    start_options.filter(x => x.value >= interval.start.value) : [];
  return (
    <Grid container spacing={3} justify="center">
      <Grid item xs={5}>
        <TimeSelection
          onChange={e => onChangeLowerBound(e)}
          value={interval.start}
          optionCaption={"Start"}
          disabled={disabled}
          //className="col-2"
          options={start_options}
          isOptionDisabled={x => false}
        />
      </Grid>
      <Grid item xs={5}>
        <TimeSelection
          onChange={e => onChangeUpperBound(e)}
          value={interval.end}
          optionCaption={"End"}
          disabled={!interval.start || disabled}
          //className="col-2"
          options={end_options}
          isOptionDisabled={x => false}
        />
      </Grid>
      <Grid item xs={2}>
        <Button className="btn btn-light" 
          disabled={!interval.start || !interval.end || disabled}
          onClick={onAddOperatingHours}>Add</Button>
      </Grid>
    </Grid>
  )
}

const SettingsComponent = ({
  onAddOperatingHours,
  onChangeAdditionalPizzaLeadTime,
  onRemoveOperatingHours,
  onChangeTimeStep,
  onSubmit,
  SERVICES,
  settings
}) => {
  const classes = useStyles();
  const GenerateInitialOperatingHoursFormIntervals = (num_services) => {
    const intervals = Array(num_services).fill();
    for (var i in intervals) {
      intervals[i] = Array(7).fill({start: null, end:null});
    }
    return intervals;
  }
  const [operating_hours_form_intervals, setOperatingHoursFormIntervals] = useState(GenerateInitialOperatingHoursFormIntervals(SERVICES.length));
  
  const onSetUpperBound = (service_index, day_index, e) => {
    const new_intervals = JSON.parse(JSON.stringify(operating_hours_form_intervals));
    new_intervals[service_index][day_index] = {start: new_intervals[service_index][day_index].start, end: e};
    setOperatingHoursFormIntervals(new_intervals);
  }
  const onSetLowerBound = (service_index, day_index, e) => {
    const new_intervals = JSON.parse(JSON.stringify(operating_hours_form_intervals));
    let new_end = new_intervals[service_index][day_index].end;
    if (e && new_end && new_end.value < e.value) {
      new_end = null;
    }
    new_intervals[service_index][day_index] = {start: e, end: new_end};
    setOperatingHoursFormIntervals(new_intervals);
  }
  const AddOperatingHoursInterval = (service_index, day_index) => {
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


  const operating_hours_service_html = settings.operating_hours.map((operating_hours_week, h) => {
    const operating_hours_week_html = operating_hours_week.map((operating_hours_day, i) => {
      const operating_hours_day_intervals_html = operating_hours_day.map((interval, j) => {
        return (
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
        );
      });
      return (
        <Grid container item xs={12} spacing={1} key={i}>
          <Grid item xs={1}>
            <Moment format="dddd" parse="e">{i}</Moment>:
          </Grid>
          {operating_hours_day_intervals_html}
          <Grid item xs></Grid>
          <Grid item xs={4}>
            <OperatingHoursIntervalForm
              disabled={false}
              interval={operating_hours_form_intervals[h][i]}
              onChangeLowerBound={e => onSetLowerBound(h, i, e)}
              onChangeUpperBound={e => onSetUpperBound(h, i, e)}
              onAddOperatingHours={e => AddOperatingHoursInterval(h, i)}
              settings={settings}
              />
          </Grid>
        </Grid>
      );
    });
    return (
      <span key={h}>
        <Grid item xs={12}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="subtitle2" className={classes.title}>
                {SERVICES[h]}:
              </Typography>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={12}>
          {operating_hours_week_html}
        </Grid>
      </span>
    );
  });
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="subtitle1" className={classes.title}>
                  Dangerous settings (requires PUSH CHANGES to take effect):
                </Typography>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={12}>
            {operating_hours_service_html}
          </Grid>
          <Grid item xs={5}>
            <CheckedInputComponent
              type="number"
              label="Additional lead time per pizza beyond the first"
              className="form-control"
              value={settings.additional_pizza_lead_time}
              onFinishChanging={onChangeAdditionalPizzaLeadTime}
              inputProps={{min: 0, max: 64}}
            />
          </Grid>
          <Grid item xs={5}>
            <CheckedInputComponent
              type="number"
              label="Time Step (minutes)"
              className="form-control"
              value={settings.time_step}
              onFinishChanging={onChangeTimeStep}
              inputProps={{min: 1, max: 1440}}
            />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={onSubmit}>Push Changes</Button>
          </Grid>          
        </Grid>
      </Paper>
    </div>
  )
}


export default SettingsComponent;