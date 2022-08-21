import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, Grid, Button } from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react';
import { HOST_API } from '../../config';
import { useAppSelector } from '../../hooks/useRedux';
import { CheckedNumericInput } from './CheckedNumericTextInput';

const GenerateCleanDirtyArray = (fulfillments: Record<string, any>) => Object.entries(fulfillments).reduce((acc, [key, v])=>({...acc, [key]: false}), {})

const LeadTimesComp = () => {
  const FULFILLMENTS = useAppSelector(s => s.ws.fulfillments!);
  const { getAccessTokenSilently } = useAuth0();
  const [dirty, setDirty] = useState<Record<string, boolean>>(GenerateCleanDirtyArray(FULFILLMENTS));
  const [localLeadTime, setLocalLeadTime] = useState<Record<string, number>>(Object.values(FULFILLMENTS).reduce((acc, x)=>({...acc, [x.id]: x.leadTime}), {}));
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setLocalLeadTime(Object.entries(localLeadTime).reduce((acc, [key, value]) => ({...acc, [key]: dirty[key] ? value : FULFILLMENTS[key].leadTime}), {}))
  }, [FULFILLMENTS]);
  const onChangeLeadTimes = (fId: string, leadTime: number) => {
    if (localLeadTime[fId] !== leadTime) {
      setLocalLeadTime({...localLeadTime, [fId]: leadTime });
      setDirty({...dirty, [fId]: true });
    }
  };
  const onSubmit = async () => {
    if (!isProcessing) {
      console.log(JSON.stringify(localLeadTime));
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
          setDirty(GenerateCleanDirtyArray(FULFILLMENTS));

        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };
  return (
    <Card>
      <CardHeader title="Single pizza lead time:" sx={{ mb: 3 }} />
      <Grid container justifyContent="center">
        <Grid item container xs={10}>
          {Object.values(FULFILLMENTS).map((fulfillment, _, arr) => (
            <Grid item xs={Math.floor(12 / arr.length)} key={fulfillment.id} >
            <CheckedNumericInput
              type="number"
              sx={{ ml: 3, mb: 2, mr: 1 }}
              label={fulfillment.displayName}
              inputProps={{ inputMode: 'numeric', min: 1, max: 43200, pattern: '[0-9]*', step: 1 }}
              value={dirty[fulfillment.id] ? localLeadTime[fulfillment.id] : fulfillment.leadTime }
              disabled={isProcessing}
              color={dirty[fulfillment.id] ? 'info' : 'primary'}
              onChange={(e) => onChangeLeadTimes(fulfillment.id, e)}
              parseFunction={parseInt}
              allowEmpty={false} />
          </Grid>
          ))}
        </Grid>
        <Grid item xs={2}>
          <Button disabled={isProcessing} onClick={onSubmit}>Push Changes</Button>
        </Grid>
      </Grid>
    </Card>
  );
}
export default LeadTimesComp;