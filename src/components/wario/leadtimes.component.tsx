import { useState, useEffect } from 'react';
import { Card, CardHeader, Grid, Button } from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react';
import { HOST_API } from '../../config';
import { useAppSelector } from '../../hooks/useRedux';
import { IntNumericPropertyComponent } from './property-components/IntNumericPropertyComponent';

const GenerateCleanDirtyArray = (fulfillments: Record<string, any>) => Object.entries(fulfillments).reduce((acc, [key, v]) => ({ ...acc, [key]: false }), {})

const LeadTimesComp = () => {
  const FULFILLMENTS = useAppSelector(s => s.ws.fulfillments!);
  const { getAccessTokenSilently } = useAuth0();
  const [dirty, setDirty] = useState<Record<string, boolean>>(GenerateCleanDirtyArray(FULFILLMENTS));
  const [localLeadTime, setLocalLeadTime] = useState<Record<string, number>>(Object.values(FULFILLMENTS).reduce((acc, x) => ({ ...acc, [x.id]: x.leadTime }), {}));
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setLocalLeadTime(Object.entries(localLeadTime).reduce((acc, [key, value]) => ({ ...acc, [key]: dirty[key] ? value : FULFILLMENTS[key].leadTime }), {}))
  }, [FULFILLMENTS, dirty]);
  const onChangeLeadTimes = (fId: string, leadTime: number) => {
    if (localLeadTime[fId] !== leadTime) {
      setLocalLeadTime({ ...localLeadTime, [fId]: leadTime });
      setDirty({ ...dirty, [fId]: FULFILLMENTS[fId].leadTime !== leadTime });
    }
  };
  const onSubmit = async () => {
    if (!isProcessing) {
      const body = Object.entries(localLeadTime).reduce( (acc, [key, value]) => dirty[key] ? ({...acc, [key]: value}) : acc, {});
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:order_config" });
        const response = await fetch(`${HOST_API}/api/v1/config/timing/leadtime`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body)
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
      <Grid container spacing={2} justifyContent="center">
        <Grid item spacing={2} container alignItems={'center'} xs={8} md={10}>
          {Object.values(FULFILLMENTS).map((fulfillment, _, arr) => {
            const arrLength = arr.length;
            const isMod2 = arrLength % 2 === 0;
            const isMod3 = arrLength % 3 === 0;
            return (
              <Grid item xs={isMod2 ? 6 : 12} md={isMod2 ? 6 : (isMod3 ? 4 : 12)} key={fulfillment.id} >
                <IntNumericPropertyComponent
                  sx={{ ml: 3, mb: 2, mr: 1 }}
                  min={1}
                  color={dirty[fulfillment.id] ? 'warning' : 'primary'}
                  disabled={isProcessing}
                  label={fulfillment.displayName}
                  value={dirty[fulfillment.id] ? localLeadTime[fulfillment.id] : fulfillment.leadTime}
                  setValue={(e : number) => onChangeLeadTimes(fulfillment.id, e)}
                />
              </Grid>
            )
          }
          )}
        </Grid>
        <Grid item xs={4} md={2} sx={{py:2}} >
          <Button sx={{mx:3, px: 1, py:2}} disabled={isProcessing} onClick={onSubmit}>Push Changes</Button>
        </Grid>
      </Grid>
    </Card>
  );
}
export default LeadTimesComp;