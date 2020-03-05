import React, { useState } from 'react';
import Moment from 'react-moment';
import memoizeOne from 'memoize-one';

import TimeSelection from "./timepicker.component";
import CheckedInputComponent from "./checked_input.component";
const WDateUtils = require("@wcp/wcpshared");

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
    <div className="container row">
        <TimeSelection
          onChange={e => onChangeLowerBound(e)}
          value={interval.start}
          optionCaption={"Start"}
          disabled={disabled}
          className="col-2"
          options={start_options}
          isOptionDisabled={x => false}
        />
        <TimeSelection
          onChange={e => onChangeUpperBound(e)}
          value={interval.end}
          optionCaption={"End"}
          disabled={!interval.start || disabled}
          className="col-2"
          options={end_options}
          isOptionDisabled={x => false}
        />
        <div className="col-1">
          <button
            className="btn btn-light"
            type="button"
            disabled={!interval.start || !interval.end || disabled}
            onClick={onAddOperatingHours}>Add</button>
        </div>
    </div>
  )
}

const SettingsComponent = ({
  onAddOperatingHours,
  onChangeAdditionalPizzaLeadTime,
  onRemoveOperatingHours,
  onChangeTimeStep,
  SERVICES,
  settings
}) => {

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
          <div className="col-1.5 mr-5" key={j}>
            {WDateUtils.MinutesToPrintTime(interval[0])}
            &nbsp;-&nbsp;
            {WDateUtils.MinutesToPrintTime(interval[1])}
            <button
              className="btn btn-light"
              type="button"
              onClick={() => onRemoveOperatingHours(h, i, j)}>x
            </button>
          </div>
        );
      });
      return (
        <div className="row" key={i}>
          <div className="col-1 ml-3">
            <Moment format="dddd" parse="e">{i}</Moment>:
          </div>
          {operating_hours_day_intervals_html}
          <div className="col-7 ml-md-auto">
          <OperatingHoursIntervalForm
            disabled={false}
            interval={operating_hours_form_intervals[h][i]}
            onChangeLowerBound={e => onSetLowerBound(h, i, e)}
            onChangeUpperBound={e => onSetUpperBound(h, i, e)}
            onAddOperatingHours={e => AddOperatingHoursInterval(h, i)}
            settings={settings}
            />
            </div>
        </div>
      );
    });
    return (
      <span key={h}>
        <h5>{SERVICES[h]}:</h5>
        {operating_hours_week_html}
      </span>
    );
  });
  return (
    <span>
      <div className="row no-gutters form-inline">
        <label>Additional lead time per pizza beyond the first: </label>
        <CheckedInputComponent
          type="number"
          className="form-control"
          value={settings.additional_pizza_lead_time}
          onFinishChanging={onChangeAdditionalPizzaLeadTime}
        />
      </div>
      <div className="row no-gutters form-inline">
        <label>Time Step: </label>
        <CheckedInputComponent
          type="number"
          className="form-control"
          value={settings.time_step}
          onFinishChanging={onChangeTimeStep}
        />
      </div>
      {operating_hours_service_html}
    </span>
  )
}


export default SettingsComponent;