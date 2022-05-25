import React, { useState } from 'react';
import { Card, CardHeader, Grid, Button } from '@mui/material'
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
      <Grid item xs={Math.floor(12/LEADTIME.length)} key={i}>
        <CheckedInputComponent
        sx={{ml:3, mb: 2, mr: 1}} 
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
      <Card>
        <CardHeader title="Single pizza lead time:" sx={{ mb: 3 }} />
        <Grid container justifyContent="center">
          <Grid item xs={10}>
            <Grid container>{leadtime_html}</Grid>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={onSubmit}>Push Changes</Button>
          </Grid>
        </Grid>
      </Card>
  );
}
export default LeadTimesComp;