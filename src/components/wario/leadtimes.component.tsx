import React, { useState } from 'react';
import { Card, CardHeader, Grid, Button } from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react';
import CheckedInputComponent from "./checked_input.component";

const LeadTimesComp = ({
  ENDPOINT,
  LEADTIME,
  SERVICES
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [ dirty, setDirty ] = useState(Array(SERVICES.length).fill(false));
  const [ localLeadTime, setLocalLeadTime ] = useState(LEADTIME);
  const [ isProcessing, setIsProcessing ] = useState(false);

  const onChangeLeadTimes = (i, e) => {
    const newDirtyArray = dirty.slice();
    newDirtyArray[i] = true;

    const newLocalLeadTime = localLeadTime.slice();
    newLocalLeadTime[i] = e;
    setLocalLeadTime(newLocalLeadTime);
    setDirty(newDirtyArray);
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
          body: JSON.stringify(localLeadTime)
        });
        if (response.status === 201) {
          setLocalLeadTime(await response.json());
          setDirty(Array(SERVICES.length).fill(false));
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };
  const leadtime_html = localLeadTime ? localLeadTime.map((x, i) => (
      <Grid item xs={Math.floor(12/LEADTIME.length)} key={i} >
        <CheckedInputComponent
          sx={{ml:3, mb: 2, mr: 1}} 
          label={SERVICES[i]}
          className="form-control"
          type="number"
          inputProps={{min: 1, max: 43200}}
          value={dirty[i] ? x : LEADTIME[i]}
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