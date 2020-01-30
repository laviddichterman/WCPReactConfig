import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import socketIOClient from "socket.io-client";
import BlockOffComp from "./components/blockoff.component";
import LeadTimesComp from "./components/leadtimes.component";
import SettingsComp from "./components/settings.component";
import { useAuth0 } from "./react-auth0-spa";


import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.yellow,
  },
}));

const WDateUtils = require("@wcp/wcpshared");

const store = "Windy City Pie";
const ENDPOINT = "http://localhost:4001";

const App = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = React.useState(0);
  const { loading, getTokenSilently, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [ socket ] = useState(socketIOClient(ENDPOINT, {autoConnect: false, secure: true}));
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

  useEffect(() => {
    let token;
    const getToken = async () => {
      token = await getTokenSilently();
      socket.open();
      socket.on("connect", () => { 
        socket.emit("authenticate", { token: token })
        .on("authenticated", () => {
          socket.on("WCP_SERVICES", data => setSERVICES(data));
          socket.on("WCP_BLOCKED_OFF", data => setBLOCKED_OFF(data));
          socket.on("WCP_LEAD_TIMES", data => setLEADTIME(data));
          socket.on("WCP_SETTINGS", data => setSETTINGS(data));
        })
        .on("unauthorized", (msg) => {
          console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
          throw new Error(msg.data.type);
        });
      });
    }
    if (!loading && isAuthenticated) {
      getToken();
    }
    if (!loading && !isAuthenticated) { 
      //loginWithRedirect();      
    }
  }, [loading, getTokenSilently, socket, isAuthenticated, loginWithRedirect]);

  // const onSubmitServices = () => {
  //   socket.emit("WCP_SERVICES", SERVICES);
  // }

  const onSubmitBlockedOff = () => {
    socket.emit("WCP_BLOCKED_OFF", BLOCKED_OFF);
  }

  const onSubmitSettings = () => {
    socket.emit("WCP_SETTINGS", SETTINGS);
  }

  const onSubmitLeadTimes = () => {
    socket.emit("WCP_LEAD_TIMES", LEADTIME);
  }

  const handleChangeTab = (event, newTab) => {
    setCurrentTab(newTab);
  };

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
      <div className={classes.root}>
        <AppBar position="static">
          {!isAuthenticated && <Button onClick={() => loginWithRedirect({})}>Log in</Button>}
          {isAuthenticated &&
            <Tabs value={currentTab} onChange={handleChangeTab} aria-label="backend config">
              <Tab label="Blocked-Off Times" {...a11yProps(0)} />
              <Tab label="Lead Times" {...a11yProps(1)} />
              <Tab label="Settings" {...a11yProps(2)} />
              <Button color="secondary" onClick={() => logout()}>Log out</Button>
            </Tabs>
          }
        </AppBar>
        {isAuthenticated &&
        <span>
        <TabPanel value={currentTab} index={0}>
          <BlockOffComp
                SERVICES={SERVICES}
                blocked_off={BLOCKED_OFF}
                addBlockedOffInterval={addBlockedOffInterval}
                RemoveInterval={removeBlockedOffInterval}
                SETTINGS={SETTINGS}
                onSubmit={onSubmitBlockedOff}
              />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
        <LeadTimesComp
              leadtimes={LEADTIME}
              SERVICES={SERVICES}
              onChange={onChangeLeadTimes}
              onSubmit={onSubmitLeadTimes}
            />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
        <SettingsComp
              SERVICES={SERVICES}
              settings={SETTINGS}
              onChangeTimeStep={onChangeTimeStep}
              onChangeAdditionalPizzaLeadTime={onChangeAdditionalPizzaLeadTime}
              onAddOperatingHours={addOperatingHours}
              onRemoveOperatingHours={removeOperatingHours}
              onSubmit={onSubmitSettings}
            />
        </TabPanel>
        </span>
      }
        </div>
    );
  }

export default App;
