import React, { } from 'react';
import CheckedInputComponent from "./checked_input.component";

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';



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


const LeadTimesComp = ({
  leadtimes,
  SERVICES,
  onChange,
  onSubmit
}) => {
  const classes = useStyles();
  const leadtime_html = leadtimes.map((x, i) => {
    return (
      <Grid item xs={4} key={i}>
        <CheckedInputComponent
          label={SERVICES[i]}
          className="form-control"
          type="number"
          //InputCheckFunction={CheckedInputComponent.CheckForNumberGTZero}
          value={x}
          onFinishChanging={(e) => onChange(i, e)}
          />
      </Grid>
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
                Single pizza lead time:
              </Typography>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={10}>
          <Grid container spacing={3} >{leadtime_html}</Grid>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={onSubmit}>Push Changes</Button>
        </Grid>
      </Grid>
      </Paper>
    </div>
    )
}
export default LeadTimesComp;