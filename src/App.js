import React, { useState, useEffect } from "react";
import { WDateUtils } from "@wcp/wcpshared";

import "bootstrap/dist/css/bootstrap.min.css";
import PACKAGE_JSON from "../package.json";
import socketIOClient from "socket.io-client";
import BlockOffComp from "./components/blockoff.component";
import LeadTimesComp from "./components/leadtimes.component";
import MenuBuilderComponent from "./components/menu/menu_builder.component";
import StoreCreditComponent from "./components/store_credit.component";
import SettingsComp from "./components/settings.component";
import DeliveryAreaComp from "./components/deliveryarea.component";
import KeyValuesComponent from "./components/keyvalues.component";
import FooterComponent from "./components/footer.component";
import { useAuth0 } from '@auth0/auth0-react';

import PropTypes from 'prop-types';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
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


const theme = createMuiTheme({
  // palette: {
  //   type: 'dark',
  // },
});

//const ENDPOINT = "https://wario.windycitypie.com";
//const ENDPOINT = "https://wario.breezytownpizza.com";
const ENDPOINT = "http://localhost:4001";

const IO_CLIENT_AUTH = socketIOClient(`${ENDPOINT}/nsAuth`, { autoConnect: false, secure: true, cookie: false });
const IO_CLIENT_RO = socketIOClient(`${ENDPOINT}/nsRO`, { autoConnect: false, secure: true, cookie: false });

const App = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = React.useState(0);
  const { isLoading, getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [socketAuth] = useState(IO_CLIENT_AUTH);
  const [socketRo] = useState(IO_CLIENT_RO);
  const [SERVICES, setSERVICES] = useState([]);
  const [BLOCKED_OFF, setBLOCKED_OFF] = useState();
  const [LEADTIME, setLEADTIME] = useState();
  const [SETTINGS, setSETTINGS] = useState({
    additional_pizza_lead_time: 5, //to deprecate
    time_step: 15,
    pipeline_info: {
      baking_pipeline: [{ slots: 3, time: 3 }, { slots: 12, time: 11 }, { slots: 10, time: 12.5 }],
      transfer_padding: .5
    },
    operating_hours: [
      [[], [], [], [], [], [], []], [[], [], [], [], [], [], []], [[], [], [], [], [], [], []]
    ]
  });
  const [DELIVERY_AREA, setDELIVERY_AREA] = useState({});
  const [KEYVALUES, setKEYVALUES] = useState({});
  const [CATALOG, setCATALOG] = useState({ 
    modifiers: {},
    categories: {},
    products: {},
    orphan_products: [],
    version: "NONE"
  });

  useEffect(() => {
    let token;
    const getToken = async () => {
      token = await getAccessTokenSilently();
      socketAuth.open();
      socketAuth.on("connect", () => {
        socketAuth.emit("authenticate", { token: token })
          .on("authenticated", () => {
            socketAuth.on("AUTH_KEYVALUES", data => setKEYVALUES(data));
          })
          .on("unauthorized", (msg) => {
            console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
            logout();
          });
      });
    }

    if (!isLoading && isAuthenticated) {
      getToken();
    }
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, getAccessTokenSilently, socketAuth, isAuthenticated, loginWithRedirect, logout]);

  useEffect(() => {
    socketRo.open();
    socketRo.on("connect", () => {
      socketRo.on("WCP_SERVICES", data => setSERVICES(data));
      socketRo.on("WCP_BLOCKED_OFF", data => setBLOCKED_OFF(data));
      socketRo.on("WCP_LEAD_TIMES", data => setLEADTIME(data));
      socketRo.on("WCP_SETTINGS", data => setSETTINGS(data));
      socketRo.on("WCP_DELIVERY_AREA", data => setDELIVERY_AREA(data));
      socketRo.on("WCP_CATALOG", data => setCATALOG(data));
    });
    return function() {
      socketRo.disconnect();
    };
  }, [socketRo]);

  // const onSubmitServices = () => {
  //   socket.emit("WCP_SERVICES", SERVICES);
  // }

  const onSubmitSettings = () => {
    socketAuth.emit("AUTH_SETTINGS", SETTINGS);
  }

  const onSubmitDeliveryArea = () => {
    socketAuth.emit("AUTH_DELIVERY_AREA", DELIVERY_AREA);
  }

  const onSubmitKeyValues = () => {
    socketAuth.emit("AUTH_KEYVALUES", KEYVALUES);
  }

  const onSubmitLeadTimes = (e) => {
    e.preventDefault();
    socketAuth.emit("AUTH_LEAD_TIMES", LEADTIME);
  }

  const handleChangeTab = (event, newTab) => {
    event.preventDefault();
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
    socketAuth.emit("AUTH_BLOCKED_OFF", new_blocked_off);
  }

  const removeBlockedOffInterval = (service_index, day_index, interval_index) => {
    const new_blocked_off = WDateUtils.RemoveInterval(
      service_index,
      day_index,
      interval_index,
      BLOCKED_OFF);
    setBLOCKED_OFF(new_blocked_off);
    socketAuth.emit("AUTH_BLOCKED_OFF", new_blocked_off);
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

  const removeKeyValuePair = (key) => {
    const new_dict = JSON.parse(JSON.stringify(KEYVALUES));
    delete new_dict[key];
    setKEYVALUES(new_dict);
  }
  const addNewKeyValuePair = (key, value) => {
    const new_dict = JSON.parse(JSON.stringify(KEYVALUES));
    new_dict[key] = value;
    setKEYVALUES(new_dict);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar position="static"><Button onClick={() => loginWithRedirect({})}>Log in</Button></AppBar>
        </div>
      </ThemeProvider>
    )
  }
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={currentTab} onChange={handleChangeTab} aria-label="backend config">
            <Tab label="Timing Configuration" {...a11yProps(0)} />
            <Tab label="Store Credit" {...a11yProps(1)} />
            <Tab label="Menu" {...a11yProps(2)} />
            <Tab label="Settings" {...a11yProps(3)} />
            <Tab label="Log Out" component={Button} color="secondary" onClick={() => logout()} />
          </Tabs>
        </AppBar>
        <TabPanel value={currentTab} index={0}>
          <LeadTimesComp
            leadtimes={LEADTIME}
            SERVICES={SERVICES}
            onChange={onChangeLeadTimes}
            onSubmit={onSubmitLeadTimes}
          />
          <BlockOffComp
            SERVICES={SERVICES}
            blocked_off={BLOCKED_OFF}
            addBlockedOffInterval={addBlockedOffInterval}
            RemoveInterval={removeBlockedOffInterval}
            SETTINGS={SETTINGS}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <StoreCreditComponent
            ENDPOINT={ENDPOINT}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <MenuBuilderComponent
            catalog={CATALOG}
            ENDPOINT={ENDPOINT}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          <SettingsComp
            SERVICES={SERVICES}
            settings={SETTINGS}
            onChangeTimeStep={onChangeTimeStep}
            onChangeAdditionalPizzaLeadTime={onChangeAdditionalPizzaLeadTime}
            onAddOperatingHours={addOperatingHours}
            onRemoveOperatingHours={removeOperatingHours}
            onSubmit={onSubmitSettings}
          />
          <DeliveryAreaComp
            DELIVERY_AREA={DELIVERY_AREA}
            onChange={e => setDELIVERY_AREA(e)}
            onSubmit={onSubmitDeliveryArea}
          />
          <KeyValuesComponent
            KEYVALUES={KEYVALUES}
            onRemoveKeyValuePair={removeKeyValuePair}
            onAddNewKeyValuePair={addNewKeyValuePair}
            onSubmit={onSubmitKeyValues}
          />
        </TabPanel>
      </div>
      <FooterComponent>WARIO Backend Application version {PACKAGE_JSON.version}</FooterComponent>
    </ThemeProvider>
  );
}

export default App;
