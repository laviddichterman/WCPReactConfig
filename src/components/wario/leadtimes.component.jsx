import React, { useState } from 'react';


import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import { useAuth0 } from '@auth0/auth0-react';
import CheckedInputComponent from "./checked_input.component";

const LeadTimesComp = ({
  ENDPOINT,
  LEADTIME,
  setLEADTIME,
  SERVICES
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const onChangeLeadTimes = (i, e) => {
    const leadtimes = LEADTIME.slice();
    leadtimes[i] = e;
    setLEADTIME(leadtimes);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently( { scope: "write:order_config" });
        const response = await fetch(`${ENDPOINT}/api/v1/config/timing/leadtime`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(LEADTIME)
        });
        if (response.status === 201) {
          setLEADTIME(await response.json());
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };
  const leadtime_html = LEADTIME ? LEADTIME.map((x, i) => (
      <Grid item xs={4} key={i}>
        <CheckedInputComponent
          label={SERVICES[i]}
          className="form-control"
          type="number"
          inputProps={{min: 1, max: 43200}}
          value={x}
          onFinishChanging={(e) => onChangeLeadTimes(i, e)}
          />
      </Grid>
    )) : "";
  return (
    <div>
      <Paper>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="subtitle1">
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
  );
}
export default LeadTimesComp;