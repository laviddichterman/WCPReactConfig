import React, { useState } from 'react';

import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useAuth0 } from '@auth0/auth0-react';

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
  ENDPOINT,
  DELIVERY_AREA,
  setDELIVERY_AREA,
}) => {
  const [ stringified, setStringified ] = useState(JSON.stringify(DELIVERY_AREA));
  const [ dirty, setDirty ] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const classes = useStyles();

  const postDeliveryArea = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:order_config"} );
        const response = await fetch(`${ENDPOINT}/api/v1/addresses`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: stringified
        });
        // if (response.status === 201) {
        // }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };
  const onBlurLocal = (val) => {
    setDELIVERY_AREA(val);
  }
  const onChangeLocal = (val) => {
    setDirty(true);
    setStringified(val);
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={3} justifyContent="center">
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
          <TextField aria-label="textarea" rows={15} fullWidth={true} multiline={true} value={dirty ? stringified : JSON.stringify(DELIVERY_AREA)} onChange={e => onChangeLocal(e.target.value)} onBlur={e => onBlurLocal(JSON.parse(stringified))} />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={postDeliveryArea}>Push Changes</Button>
          </Grid>
          </Grid>
      </Paper>
    </div>
  );
}
export default DeliveryAreaComponent;