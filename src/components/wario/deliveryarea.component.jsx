import React, { useState } from 'react';

import { Button, TextField, Grid, Card, CardHeader } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

import useSocketIo from '../../hooks/useSocketIo';


const DeliveryAreaComponent = ({
  ENDPOINT
}) => {
  const { deliveryArea } = useSocketIo();
  const [ localDeliveryArea, setLocalDeliveryArea ] = useState(deliveryArea);
  const [ stringified, setStringified ] = useState(JSON.stringify(deliveryArea));
  const [ dirty, setDirty ] = useState(false);
  const [ isJsonError, setIsJsonError ] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

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
        // eslint-disable-next-line no-empty
        if (response.status === 201) {
          setDirty(false);
          const resJson = await response.json();
          setLocalDeliveryArea(resJson);
          setStringified(JSON.stringify(resJson));
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };
  const onBlurLocal = (val) => {
    try {
      setLocalDeliveryArea(JSON.parse(val));
      setIsJsonError(false);
    }
    catch (e) {
      setIsJsonError(true);
    }
  }
  const onChangeLocal = (val) => {
    setDirty(true);
    setStringified(val);
  }

  return (
      <Card>
        <CardHeader title={"Delivery Area GeoJSON (polygon)"} />
        <Grid container spacing={3} justifyContent="center">   
          <Grid item xs={10}>
          <TextField 
            aria-label="textarea" 
            rows={15} 
            fullWidth
            multiline 
            value={dirty ? stringified : JSON.stringify(localDeliveryArea)} 
            onChange={e => onChangeLocal(e.target.value)} 
            onBlur={() => onBlurLocal(stringified)}
            error={isJsonError}
            helperText={isJsonError ? "JSON Parsing Error" : ""}
          />
          </Grid>
          <Grid item xs={2}>
            <Button disabled={isJsonError} onClick={postDeliveryArea}>Push Changes</Button>
          </Grid>
          </Grid>
      </Card>
  );
}
export default DeliveryAreaComponent;