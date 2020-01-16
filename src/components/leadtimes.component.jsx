import React, { Component } from 'react';
import CheckedInput from "./checked_input.component";

export default class LeadTimesComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leadtimes: props.leadtimes,
      SERVICES: props.SERVICES,
      onChange: props.onChange,
    };
  }
  
  render() {
    const leadtime_html = this.props.leadtimes.map((x, i) => {
      return (
        <div key={i} className="form-inline">
            <label>{this.props.service}
              <CheckedInput
                className="form-control"
                type="number"
                InputCheckFunction={CheckedInput.CheckForNumberGTZero}
                value={x}
                onFinishChanging={(e) => this.props.onChange(i, e)}
                />
            </label>
        </div>
      )
    });
    return (
      <div className="row no-gutters">
        <div className="col">
          Single pizza lead time:
        </div>
        <div className="col">{leadtime_html}</div>
      </div>
      )
  }
}
