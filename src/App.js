import React, { useState, useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import socketIOClient from "socket.io-client";
import BlockOffComp from "./components/blockoff.component";
import LeadTimesComp from "./components/leadtimes.component";
import SettingsComp from "./components/settings.component";
import NavBar from "./components/navbar.component";
import { useAuth0 } from "./react-auth0-spa";
import Profile from "./components/profile.component";
import history from "./utils/history";


const WDateUtils = require("@wcp/wcpshared");

const store = "Windy City Pie";
const ENDPOINT = "https://wario.windycitypie.com";

const App = () => {
  const { loading } = useAuth0();
  const [ socket ] = useState(socketIOClient(ENDPOINT));
  const [ SERVICES, setSERVICES ] = useState(["Pick-up", "Dine-In", "Delivery"]);
  const [ BLOCKED_OFF, setBLOCKED_OFF ] = useState([]);
  const [ LEADTIME, setLEADTIME ] = useState([40, 40, 1440]);
  const [ SETTINGS, setSETTINGS ] = useState({
    additional_pizza_lead_time: 5, //to deprecate
    time_step: 15,
    pipeline_info: {
      baking_pipeline: [{slots:3, time:3}, {slots: 12, time:11}, {slots:10, time:12.5}],
      transfer_padding: .5},
    operating_hours: [
      [[], [], [], [], [], [], []],[[], [], [], [], [], [], []],[[], [], [], [], [], [], []]
    ]
  });
  const [ canSubmit ] = useState(true);

  useEffect(() => {
    socket.on("WCP_SERVICES", data => setSERVICES(data));
    socket.on("WCP_BLOCKED_OFF", data => setBLOCKED_OFF(data));
    socket.on("WCP_LEAD_TIMES", data => setLEADTIME(data));
    socket.on("WCP_SETTINGS", data => setSETTINGS(data));
  });

  const onSubmit = () => {
    socket.emit("WCP_SERVICES", SERVICES);
    socket.emit("WCP_BLOCKED_OFF", BLOCKED_OFF);
    socket.emit("WCP_SETTINGS", SETTINGS);
    socket.emit("WCP_LEAD_TIMES", LEADTIME);
  }


  const onChangeLeadTimes = (i, e) => {
    const leadtimes = LEADTIME.slice();
    leadtimes[i] = e;
    setLEADTIME(leadtimes);
  }

  const onChangeAdditionalPizzaLeadTime = (e) => {
    const new_settings = JSON.parse(JSON.stringify(SETTINGS));
    new_settings.additional_pizza_lead_time = e;
    setSETTINGS(new_settings);
  }

  const onChangeTimeStep = (e) => {
    const new_settings = JSON.parse(JSON.stringify(SETTINGS));
    new_settings.time_step = parseInt(e);
    setSETTINGS(new_settings);
  }


  const addBlockedOffInterval = (parsed_date, interval, service_selection) => {
    const new_blocked_off = BLOCKED_OFF.slice();
    // iterate over services
    for (var service_index in service_selection) {
      if (service_selection[service_index]) {
        //iterate over days
        WDateUtils.AddIntervalToService(service_index, parsed_date, interval, new_blocked_off);
      }
    }
    setBLOCKED_OFF(new_blocked_off);
  }

  const removeBlockedOffInterval = (service_index, day_index, interval_index) => {
    const new_blocked_off = WDateUtils.RemoveInterval(
      service_index,
      day_index,
      interval_index,
      BLOCKED_OFF);
      setBLOCKED_OFF(new_blocked_off);
  }

  const addOperatingHours = (service_index, day_index, interval) => {
    const new_settings = JSON.parse(JSON.stringify(SETTINGS));
    WDateUtils.AddIntervalToOperatingHours(
      service_index,
      day_index,
      interval,
      new_settings.operating_hours);
    setSETTINGS(new_settings);
  }

  const removeOperatingHours = (service_index, day_index, interval_index) => {
    const new_settings = JSON.parse(JSON.stringify(SETTINGS));
    const new_operating_hours = WDateUtils.RemoveIntervalFromOperatingHours(
      service_index,
      day_index,
      interval_index,
      new_settings.operating_hours);
    new_settings.operating_hours = new_operating_hours;
    setSETTINGS(new_settings);
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
      <div className="ordercfg container-fluid row no-gutters">
        <Router history={history}>
        <header>
          <NavBar />
        </header>
        <Switch>
          <Route path="/" exact />
          <Route path="/blockoff" 
            render={() => <BlockOffComp
              SERVICES={SERVICES}
              blocked_off={BLOCKED_OFF}
              onSubmit={addBlockedOffInterval}
              RemoveInterval={removeBlockedOffInterval}
              SETTINGS={SETTINGS}
            />}
          />
          <Route path="/leadtimes" 
            render={() => <LeadTimesComp
              leadtimes={LEADTIME}
              SERVICES={SERVICES}
              onChange={onChangeLeadTimes}
            />}
          />
          <Route path="/settings" 
            render={() => <SettingsComp
              SERVICES={SERVICES}
              settings={SETTINGS}
              onChangeTimeStep={onChangeTimeStep}
              onChangeAdditionalPizzaLeadTime={onChangeAdditionalPizzaLeadTime}
              onAddOperatingHours={addOperatingHours}
              onRemoveOperatingHours={removeOperatingHours}
            />}
          />                    
        </Switch>
      </Router>
          <button className="btn btn-dark" onClick={onSubmit} disabled={!canSubmit}>Update Settings</button>
        </div>


  );
}

export default App;
