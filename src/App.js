import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import socketIOClient from "socket.io-client";
import BlockOffComp from "./components/blockoff.component";
import LeadTimesComp from "./components/leadtimes.component";
import SettingsComp from "./components/settings.component";

const WDateUtils = require("@wcp/wcpshared");

const store = "Windy City Pie";
const ENDPOINT = "http://127.0.0.1:4001";

class App extends Component {
  constructor() {
    super();
    this.state = {
      socket: socketIOClient(ENDPOINT),
      SERVICES: ["Pick-up", "Dine-In", "Delivery"],
      BLOCKED_OFF: [],
      LEADTIME: [40, 40, 1440],
      SETTINGS: {
        additional_pizza_lead_time: 5, //to deprecate
        time_step: 15,
        pipeline_info: {
          baking_pipeline: [{slots:3, time:3}, {slots: 12, time:11}, {slots:10, time:12.5}],
          transfer_padding: .5},
        operating_hours: [
          [[], [], [], [], [], [], []],[[], [], [], [], [], [], []],[[], [], [], [], [], [], []]
        ]
      },
      can_submit: true
    };
  }
  updateSettings = (data) => {
    this.setState({SETTINGS: data});
  }
  componentDidMount = () => {
    this.state.socket.on("WCP_SERVICES", data => this.setState({ SERVICES: data}));
    this.state.socket.on("WCP_BLOCKED_OFF", data => this.setState({ BLOCKED_OFF: data}));
    this.state.socket.on("WCP_LEAD_TIMES", data => this.setState({ LEADTIME: data}));
    this.state.socket.on("WCP_SETTINGS", data => (this.updateSettings(data)));

  }

  onSubmit = () => {
    this.state.socket.emit("WCP_SERVICES", this.state.SERVICES);
    this.state.socket.emit("WCP_BLOCKED_OFF", this.state.BLOCKED_OFF);
    this.state.socket.emit("WCP_SETTINGS", this.state.SETTINGS);
    this.state.socket.emit("WCP_LEAD_TIMES", this.state.LEADTIME);
  }


  onChangeLeadTimes = (i, e) => {
    const leadtimes = this.state.LEADTIME.slice();
    leadtimes[i] = e;
    this.setState({
      LEADTIME: leadtimes
    });
  }

  onChangeAdditionalPizzaLeadTime = (e) => {
    const new_settings = JSON.parse(JSON.stringify(this.state.SETTINGS));
    new_settings.additional_pizza_lead_time = e;
    this.setState({SETTINGS:new_settings});
  }

  onChangeTimeStep = (e) => {
    const new_settings = JSON.parse(JSON.stringify(this.state.SETTINGS));
    new_settings.time_step = parseInt(e);
    this.setState({SETTINGS:new_settings});
  }


  addBlockedOffInterval = (parsed_date, interval, service_selection) => {
    const new_blocked_off = this.state.BLOCKED_OFF.slice();
    // iterate over services
    for (var service_index in service_selection) {
      if (service_selection[service_index]) {
        //iterate over days
        WDateUtils.AddIntervalToService(service_index, parsed_date, interval, new_blocked_off);
      }
    }
    this.setState({BLOCKED_OFF: new_blocked_off});
  }

  removeBlockedOffInterval = (service_index, day_index, interval_index) => {
    const new_blocked_off = WDateUtils.RemoveInterval(
      service_index,
      day_index,
      interval_index,
      this.state.BLOCKED_OFF);
    this.setState({BLOCKED_OFF: new_blocked_off});
  }

  addOperatingHours = (service_index, day_index, interval) => {
    const new_settings = JSON.parse(JSON.stringify(this.state.SETTINGS));
    WDateUtils.AddIntervalToOperatingHours(
      service_index,
      day_index,
      interval,
      new_settings.operating_hours);
    this.setState({SETTINGS: new_settings});
  }

  removeOperatingHours = (service_index, day_index, interval_index) => {
    const new_settings = JSON.parse(JSON.stringify(this.state.SETTINGS));
    const new_operating_hours = WDateUtils.RemoveIntervalFromOperatingHours(
      service_index,
      day_index,
      interval_index,
      new_settings.operating_hours);
    new_settings.operating_hours = new_operating_hours;
    this.setState({SETTINGS: new_settings});
  }

  render() {
    return (
        <div className="ordercfg container-fluid">
          <h2>{store} Order Configuration</h2>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="collpase navbar-collapse">
            </div>
          </nav>
          <br/>
            <div className="row no-gutters">
              <BlockOffComp
                SERVICES={this.state.SERVICES}
                blocked_off={this.state.BLOCKED_OFF}
                onSubmit={this.addBlockedOffInterval}
                RemoveInterval={this.removeBlockedOffInterval}
                SETTINGS={this.state.SETTINGS}
              />
            </div>
            <LeadTimesComp
              leadtimes={this.state.LEADTIME}
              SERVICES={this.state.SERVICES}
              onChange={this.onChangeLeadTimes}/>
            <SettingsComp
              SERVICES={this.state.SERVICES}
              settings={this.state.SETTINGS}
              onChangeTimeStep={this.onChangeTimeStep}
              onChangeAdditionalPizzaLeadTime={this.onChangeAdditionalPizzaLeadTime}
              onAddOperatingHours={this.addOperatingHours}
              onRemoveOperatingHours={this.removeOperatingHours}
            />
            <button className="btn btn-dark" onClick={this.onSubmit} disabled={!this.state.can_submit}>Update Settings</button>
          </div>


    );
  }
}

export default App;
