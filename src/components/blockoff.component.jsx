import React, { useState } from "react";
import TimeSelection from "./timepicker.component";
import Moment from 'react-moment';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import Button from '@material-ui/core/Button';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Toolbar from '@material-ui/core/Toolbar';
import moment from 'moment';
import MomentUtils from "@date-io/moment";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Container from '@material-ui/core/Container';
import { ListItemText } from "@material-ui/core";


import { WDateUtils } from "@wcp/wcpshared";


const TrimOptionsBeforeDisabled = (opts) => {
  const idx = opts.findIndex((elt) => elt.disabled);
  return idx === -1 ? opts : opts.slice(0, idx);
}

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
  },
  listLevel0: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  listLevel1: {
    paddingLeft: theme.spacing(4),
  },
}));


const ServiceSelectionCheckbox = (props) => {
  const { selected, onChange, service_name } = props;
  return (
    <Chip
      label={service_name}
      clickable
      onDelete={(e) => onChange(e)}
      onClick={(e) => onChange(e)}
      color={selected ? "primary" : "default"}
      deleteIcon={selected ? <DoneIcon /> : <HighlightOffIcon />}
    />
  )
}

const BlockOffComp = ({
  SERVICES, 
  addBlockedOffInterval,
  blocked_off,
  SETTINGS,
  RemoveInterval,
  LEAD_TIME
}) => {
  const classes = useStyles();
  const [ upper_time, setUpperTime ] = useState(null);
  const [ lower_time, setLowerTime ] = useState(null);
  const [ selected_date, setSelectedDate ] = useState(new moment());
  const [ parsed_date, setParsedDate ] = useState(moment().format(WDateUtils.DATE_STRING_INTERNAL_FORMAT));
  const [ service_selection, setServiceSelection ] = useState(Array(SERVICES.length).fill(true));
  const [ can_submit, setCanSubmit ] = useState(false);
  const HasOptionsForDate = (date) => {
    const INFO = WDateUtils.GetInfoMapForAvailabilityComputation(blocked_off, SETTINGS, LEAD_TIME, date, service_selection, {});
    return WDateUtils.GetOptionsForDate(INFO, date, moment()).filter(x => !x.disabled).length
  }

  const onChangeServiceSelection = (e, i) => {
    e.preventDefault();
    const new_service_selection = service_selection.slice();
    new_service_selection[i] = !new_service_selection[i];
    setServiceSelection(new_service_selection);
    if (selected_date && !HasOptionsForDate(selected_date)) {
      setDate(null);
    }
  }

  const onChangeLowerBound = e => {
    let new_upper;
    if (upper_time) {
      new_upper = upper_time.value < e.value ? e : upper_time;
    }
    else {
      new_upper = e;
    }
    if (!e) {
      new_upper = null;
    }
    setCanSubmit(e && new_upper && selected_date);
    setLowerTime(e);
    setUpperTime(new_upper);
  }
  const onChangeUpperBound = e => {
    setCanSubmit(e && lower_time && selected_date);
    setUpperTime(e);
  }
  const setDate = date => {
    setSelectedDate(date);
    setParsedDate(date ?
        moment(date).format(WDateUtils.DATE_STRING_INTERNAL_FORMAT) :
        "");
    setLowerTime(null);
    setUpperTime(null);
    setCanSubmit(false);
  }


  const handleSubmit = e => {
    e.preventDefault();
    if (selected_date) {
      const interval = [lower_time.value, upper_time.value];
      addBlockedOffInterval(parsed_date, interval, service_selection);
      if (!HasOptionsForDate(selected_date)) {
        setDate(null);
      }
      else {
        setLowerTime(null);
        setUpperTime(null);
      }
    }
  }

  const services_checkboxes = SERVICES.map((x, i) => {
    return (
      <Grid item xs key={i}>
        <ServiceSelectionCheckbox
          service_name={x}
          selected={service_selection[i]}
          onChange={(e) => onChangeServiceSelection(e, i)}
        />
      </Grid>
    );
  });
  const blocked_off_html = blocked_off ? blocked_off.map((service, i) => {
    const blocked_off_days_html = blocked_off[i].map((blocked_off_for_day, j) => {
      const blocked_off_intervals_html = blocked_off[i][j][1].map((interval, k) => {
        const from_to = blocked_off[i][j][1][k][0] === blocked_off[i][j][1][k][1] ? WDateUtils.MinutesToPrintTime(blocked_off[i][j][1][k][0]) : `${WDateUtils.MinutesToPrintTime(blocked_off[i][j][1][k][0])} to ${WDateUtils.MinutesToPrintTime(blocked_off[i][j][1][k][1])}`;
        return (
          <ListItem key={k}>
            <ListItemText primary={from_to}></ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="end" size="small" aria-label="delete" onClick={() => RemoveInterval(i,j,k)}>
                <HighlightOffIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })
      return (
        <Container key={j}><ListItem>
        <Moment format="dddd, MMMM DD, Y" parse={WDateUtils.DATE_STRING_INTERNAL_FORMAT}>{blocked_off[i][j][0]}</Moment>
        </ListItem>
        <List component="div" className={classes.listLevel1}>
          {blocked_off_intervals_html}
        </List>
        </Container>
      );
    })
    return (
      <Grid key={i} item xs={Math.floor(12/SERVICES.length)}>
        <Paper className={classes.paper} >
            <AppBar position="static">
            <Toolbar><Typography variant="subtitle1" className={classes.title}>
            {SERVICES[i]}</Typography></Toolbar>
            </AppBar>
            <List component="nav" className={classes.listLevel0}>
              {blocked_off_days_html}
            </List>
          </Paper>
      </Grid>
    );
  }) : "";
  const start_options = selected_date && SETTINGS && LEAD_TIME ?
    WDateUtils.GetOptionsForDate(
      WDateUtils.GetInfoMapForAvailabilityComputation(blocked_off, SETTINGS, LEAD_TIME, selected_date, service_selection, {}), 
      selected_date,
      moment()) : [];
  const end_options = start_options.length && lower_time ?
    TrimOptionsBeforeDisabled(start_options.filter(x => x.value >= lower_time.value)) : [];
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
      <Grid container spacing={3} justify="center">
        <Grid item xs={12}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="subtitle1" className={classes.title}>
                Add blocked off time:
              </Typography>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={8}>
          <Grid container>{services_checkboxes}</Grid>
        </Grid>
        <Grid item xs={4}>
          <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
          <DatePicker
            fullWidth
            variant="inline"
            autoOk
            placeholder={"Select Date"}
            disableToolbar
            disablePast
            maxDate={moment().add(60, 'days')}
            shouldDisableDate={e => !HasOptionsForDate(e)}
            value={selected_date}
            onChange={date => setDate(date)}
            format="dddd, MMMM DD, Y"
          />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={5}>
          <TimeSelection
          onChange={e => onChangeLowerBound(e)}
          value={lower_time}
          optionCaption={"Start"}
          options={start_options.filter((elt) => !elt.disabled).map(x=>({...x, label: WDateUtils.MinutesToPrintTime(x.value)}))}
          disabled={!selected_date}
          className="col"
          />
        </Grid>
        <Grid item xs={5}>
          <TimeSelection
          onChange={e => onChangeUpperBound(e)}
          value={upper_time}
          optionCaption={"End"}
          options={end_options.map(x=>({...x, label: WDateUtils.MinutesToPrintTime(x.value)}))}
          disabled={!(selected_date && lower_time)}
          className="col"
          />
        </Grid>
        <Grid item xs={2}><Button className="btn btn-light" onClick={handleSubmit} disabled={!can_submit}>Add</Button></Grid>
      </Grid>
      </Paper>
      <Grid container justify="center" spacing={3}>
      { blocked_off_html }
      </Grid>
    <br />
    </div>
  )
}

export default BlockOffComp;