import React, { useState } from 'react';
import { Card, CardHeader, Grid, Button } from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react';
import { HOST_API } from 'src/config';
import { useAppSelector } from '../../hooks/useRedux';
import { CheckedNumericInput } from './CheckedNumericTextInput';

const LeadTimesComp = () => {
  const SERVICES = useAppSelector(s => s.ws.services);
  const LEADTIME = useAppSelector(s => s.ws.leadtime);
  const { getAccessTokenSilently } = useAuth0();
  const [dirty, setDirty] = useState(Array(SERVICES ? Object.keys(SERVICES).length : 3).fill(false));
  const [localLeadTime, setLocalLeadTime] = useState(LEADTIME || []);
  const [isProcessing, setIsProcessing] = useState(false);

  if (SERVICES === null || LEADTIME === null) {
    return <>Loading...</>;
  }

  const onChangeLeadTimes = (i: number, e: number) => {
    const newDirtyArray = dirty.slice();
    newDirtyArray[i] = true;

    const newLocalLeadTime = localLeadTime.slice();
    newLocalLeadTime[i] = e;
    setLocalLeadTime(newLocalLeadTime);
    setDirty(newDirtyArray);
  };
  const onSubmit = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:order_config" });
        const response = await fetch(`${HOST_API}/api/v1/config/timing/leadtime`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(localLeadTime)
        });
        if (response.status === 201) {
          setLocalLeadTime(await response.json());
          setDirty(Array(Object.keys(SERVICES).length).fill(false));
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };
  const leadtime_html = localLeadTime ? localLeadTime.map((x, i) => (
    <Grid item xs={Math.floor(12 / LEADTIME.length)} key={i} >
      <CheckedNumericInput
        type="number"
        sx={{ ml: 3, mb: 2, mr: 1 }}
        label={SERVICES[i]}
        inputProps={{ inputMode: 'numeric', min: 1, max: 43200, pattern: '[0-9]*', step: 1 }}
        value={dirty[i] ? x : LEADTIME[i]}
        className="form-control"
        disabled={isProcessing}
        onChange={(e) => onChangeLeadTimes(i, e)}
        parseFunction={parseInt}
        allowEmpty={false} />
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