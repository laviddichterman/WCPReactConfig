import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


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


const DeliveryAreaComponent = ({
  DELIVERY_AREA,
  onChange,
  onSubmit
}) => {
  const [ stringified, setStringified ] = useState(JSON.stringify(DELIVERY_AREA));
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={3} justify="center">
            <Grid item xs={12}>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="subtitle1" className={classes.title}>
                    Delivery Area GeoJSON (polygon)
                  </Typography>
                </Toolbar>
              </AppBar>
            </Grid>
          <Grid item xs={10}>
          <TextField aria-label="textarea" rows={15} fullWidth={true} multiline={true} value={stringified} onChange={e => setStringified(e.target.value)} onBlur={e => onChange(JSON.parse(stringified))} />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={onSubmit}>Push Changes</Button>
          </Grid>
          </Grid>
      </Paper>
    </div>
    )
}
export default DeliveryAreaComponent;