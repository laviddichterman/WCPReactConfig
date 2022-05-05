import React, { useState, useEffect } from "react";

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
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';


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


const theme = createTheme({
  // palette: {
  //   mode: 'dark',
  // },
});

//const ENDPOINT = "https://wario.windycitypie.com";
const ENDPOINT = "https://wdev.windycitypie.com";
//const ENDPOINT = "https://wstaging.windycitypie.com";
//const ENDPOINT = "https://wario.breezytownpizza.com";
//const ENDPOINT = "http://localhost:4001";

const IO_CLIENT_RO = socketIOClient(`${ENDPOINT}/nsRO`, { autoConnect: false, secure: true, cookie: false,     
  transports: ["websocket", "polling"], 
  allowEIO3: true,
  cors: {
    origin: [/.+$/, /https:\/\/.*\.breezytownpizza\.com$/, `http://localhost`],
    methods: ["GET", "POST"],
    credentials: true
  }
 });

const AppInner = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState(0);
  const { isLoading, getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [socketRo] = useState(IO_CLIENT_RO);
  const [SERVICES, setSERVICES] = useState([]);
  const [hasLoadedSERVICES, setHasLoadedSERVICES] = useState(false);
  const [BLOCKED_OFF, setBLOCKED_OFF] = useState([]);
  const [hasLoadedBLOCKED_OFF, setHasLoadedBLOCKED_OFF] = useState(false);
  const [LEADTIME, setLEADTIME] = useState();
  const [hasLoadedLEADTIME, setHasLoadedLEADTIME] = useState(false);
  const [SETTINGS, setSETTINGS] = useState();
  const [hasLoadedSETTINGS, setHasLoadedSETTINGS] = useState(false);
  const [DELIVERY_AREA, setDELIVERY_AREA] = useState({});
  const [hasLoadedDELIVERY_AREA, setHasLoadedDELIVERY_AREA] = useState(false);
  const [CATALOG, setCATALOG] = useState({ 
    modifiers: {},
    categories: {},
    products: {},
    orphan_products: [],
    version: "NONE"
  });
  const [hasLoadedCATALOG, setHasLoadedCATALOG] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      getAccessTokenSilently();
    }
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout]);

  useEffect(() => {
    socketRo.open();
    socketRo.on("connect", () => {
      socketRo.on("WCP_SERVICES", data => { setSERVICES(data); setHasLoadedSERVICES(true); } );
      socketRo.on("WCP_BLOCKED_OFF", data => {
        data.forEach(function(svc_block, i) {
          svc_block.forEach(function(day_block, j) {
            day_block[1].forEach(function(interval, k) {
              data[i][j][1][k] = [Number(data[i][j][1][k][0]), Number(data[i][j][1][k][1])];
            })
          })
        })
        setBLOCKED_OFF(data);
        setHasLoadedBLOCKED_OFF(true);
      });
      socketRo.on("WCP_LEAD_TIMES", data => { setLEADTIME(data); setHasLoadedLEADTIME(true); } );
      socketRo.on("WCP_SETTINGS", data => { setSETTINGS(data); setHasLoadedSETTINGS(true); } );
      socketRo.on("WCP_DELIVERY_AREA", data => { setDELIVERY_AREA(data); setHasLoadedDELIVERY_AREA(true); } );
      socketRo.on("WCP_CATALOG", data => { setCATALOG(data); setHasLoadedCATALOG(true); } );
    });
    return function() {
      socketRo.disconnect();
    };
  }, [socketRo]);

  const handleChangeTab = (event, newTab) => {
    event.preventDefault();
    setCurrentTab(newTab);
  };

  if (isLoading) {
    return <div>Loading Application...</div>;
  }
  if (!isAuthenticated) {
    return (
          <div className={classes.root}>
            <AppBar position="static"><Button onClick={() => loginWithRedirect({})}>Log in</Button></AppBar>
          </div>
    );
  }
  if (!hasLoadedBLOCKED_OFF || !hasLoadedCATALOG || !hasLoadedDELIVERY_AREA || !hasLoadedSETTINGS || !hasLoadedLEADTIME || !hasLoadedSERVICES) {
    return <div>Loading Configuration...</div>;
  }
  return (
      <>
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
              ENDPOINT={ENDPOINT}
              LEADTIME={LEADTIME}
              SERVICES={SERVICES}
              setLEADTIME={setLEADTIME}
            />
            <BlockOffComp
              ENDPOINT={ENDPOINT}
              SERVICES={SERVICES}
              BLOCKED_OFF={BLOCKED_OFF}
              setBLOCKED_OFF={setBLOCKED_OFF}
              LEAD_TIME={LEADTIME}
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
              ENDPOINT={ENDPOINT}
              SERVICES={SERVICES}
              SETTINGS={SETTINGS}
              setSETTINGS={setSETTINGS}
            />
            <DeliveryAreaComp
              ENDPOINT={ENDPOINT}
              DELIVERY_AREA={DELIVERY_AREA}
              onChange={e => setDELIVERY_AREA(e)}
            />
            <KeyValuesComponent
              ENDPOINT={ENDPOINT}
            />
          </TabPanel>
        </div>
        <FooterComponent>WARIO Backend Application version {PACKAGE_JSON.version}</FooterComponent>
      </>
  );
}

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <AppInner/>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App;
