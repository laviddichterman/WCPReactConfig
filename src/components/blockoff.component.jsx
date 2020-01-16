import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import TimeSelection from "./timepicker.component";
import Moment from 'react-moment';
import moment from 'moment';
const WDateUtils = require("@wcp/wcpshared");

class ServiceSelectionCheckbox extends Component {
  render() {
    return (
      <label className="form-check-label">
      {this.props.service_name}:
      <input
        className="form-check-input"
        type="checkbox"
        checked={this.props.selected}
        onChange={(e) => this.props.onChange(e)}
      />
      </label>
    )
  }
}

export default class BlockOffComp extends Component {
    constructor(props) {
      super(props);
      this.state = {
          upper_time: null,
          lower_time: null,
          selected_date: null,
          parsed_date: "",
          time_interval: 15,
          min_upper: "",
          service_selection: Array(props.SERVICES.length).fill(true),
          can_submit: false
      }
    }

    onChangeServiceSelection = (e, i) => {
      const new_service_selection = this.state.service_selection.slice();
      new_service_selection[i] = !new_service_selection[i];
      this.setState({service_selection: new_service_selection});
    }

    onChangeLowerBound = e => {
      let new_upper;
      if (this.state.upper_time) {
        new_upper = this.state.upper_time < e.value ? e.value : this.state.upper_time;
      }
      else {
        new_upper = e;
      }
      if (!e) {
        new_upper = null;
      }
      const can_submit = (e && new_upper && this.state.selected_date);
      this.setState({
        lower_time: e,
        upper_time: new_upper,
        min_upper: e,
        can_submit: can_submit
      })
    }
    onChangeUpperBound = e => {
      const can_submit = (e && this.state.lower_time && this.state.selected_date);
      this.setState({
        upper_time: e,
        can_submit: can_submit
      });
    }
    setDate = date => {
      this.setState({
        selected_date: date,
        parsed_date: date ?
          moment(date).format(WDateUtils.DATE_STRING_INTERNAL_FORMAT) :
          "",
        lower_time:null,
        upper_time:null,
        can_submit:false
      });
    }


    handleSubmit = e => {
      e.preventDefault();
      if (this.state.selected_date) {
        const interval = [this.state.lower_time.value, this.state.upper_time.value];
        this.props.onSubmit(this.state.parsed_date, interval, this.state.service_selection);
        this.setDate(null);
      }
    }

    render() {
      const services_checkboxes = this.props.SERVICES.map((x, i) => {
        return (
          <div key={i} className="form-check form-check-inline">
            <ServiceSelectionCheckbox
              service_name={x}
              selected={this.state.service_selection[i]}
              onChange={(e) => this.onChangeServiceSelection(e, i)}
            />
          </div>
        );
      })
      const blocked_off_html = this.props.blocked_off.map((service, i) => {
        const blocked_off_days_html = this.props.blocked_off[i].map((blocked_off_for_day, j) => {
          const blocked_off_intervals_html = this.props.blocked_off[i][j][1].map((interval, k) => {
            return (
              <div key={k}>
                from&nbsp;
                {WDateUtils.MinutesToPrintTime(this.props.blocked_off[i][j][1][k][0])}
                 &nbsp;to&nbsp;
                {WDateUtils.MinutesToPrintTime(this.props.blocked_off[i][j][1][k][1])}
                <button className="btn btn-light" type="button" onClick={() => this.props.RemoveInterval(i,j,k)}>x</button>
              </div>
            );
          })
          return (
            <div key={j}>
            <Moment format="dddd, MMMM DD, Y" parse={WDateUtils.DATE_STRING_INTERNAL_FORMAT}>{this.props.blocked_off[i][j][0]}</Moment>
            {blocked_off_intervals_html}</div>
          );
        })
        return (
          <div key={i}>
            <span>{this.props.SERVICES[i]}</span>
            {blocked_off_days_html}
          </div>
        );
      })
      const start_options = this.state.selected_date ?
        WDateUtils.GetOptionsForDate(this.props.blocked_off,
          this.props.SETTINGS.operating_hours,
          this.state.service_selection,
          this.state.parsed_date,
          this.props.SETTINGS.time_step) : [];
      //TODO : change this to filter all values not in the current interval
      const end_options = start_options.length && this.state.lower_time ?
        start_options.filter(x => x.value >= this.state.lower_time.value) : [];
      return (
        <div>
        { blocked_off_html }
        <br />
          {services_checkboxes}
          <br />
          <div className="row">
          <div className="col">
            <DatePicker
              selected={this.state.selected_date}
              onChange={date => this.setDate(date)}
              dateFormat="EEEE, MMMM dd, y"
            />
          </div>
          <TimeSelection
            onChange={e => this.onChangeLowerBound(e)}
            value={this.state.lower_time}
            optionCaption={"Start"}
            options={start_options}
            disabled={!this.state.selected_date}
            className="col"
          />
          <TimeSelection
            onChange={e => this.onChangeUpperBound(e)}
            value={this.state.upper_time}
            optionCaption={"End"}
            options={end_options}
            disabled={!(this.state.selected_date && this.state.lower_time)}
            className="col"
          />
          <button className="btn btn-light" onClick={this.handleSubmit} disabled={!this.state.can_submit}>Add</button>
          </div>
        </div>
      )
  }
}
