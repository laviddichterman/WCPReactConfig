import { useState } from 'react';
import { Card, Grid } from '@mui/material';

import { FulfillmentConfig, IWSettings } from "@wcp/wcpshared";
import { DialogContainer } from '@wcp/wario-ux-shared';
import { useAuth0 } from '@auth0/auth0-react';
import { HOST_API } from '../../config';
import { useAppSelector } from '../../hooks/useRedux';
import FulfillmentAddContainer from './FulfillmentAddContainer';
import FulfillmentEditContainer from './FulfillmentEditContainer';
import FulfillmentDeleteContainer from './FulfillmentDeleteContainer';
import FulfillmentTableContainer from './FulfillmentTableContainer';

const SettingsComponent = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [isProcessing, setIsProcessing] = useState(false);
  const settings = useAppSelector(s => s.ws.settings!);
  const [localSettings, setLocalSettings] = useState<IWSettings>(settings);
  const [fulfillmentToEdit, setFulfillmentToEdit] = useState<FulfillmentConfig|null>(null);
  const [isFulfillmentAddOpen, setIsFulfillmentAddOpen] = useState(false);
  const [isFulfillmentEditOpen, setIsFulfillmentEditOpen] = useState(false);
  const [isFulfillmentDeleteOpen, setIsFulfillmentDeleteOpen] = useState(false);


  const onSubmit = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        const token = await getAccessTokenSilently({ scope: "write:order_config" });
        const response = await fetch(`${HOST_API}/api/v1/config/settings`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(localSettings)
        });
        if (response.status === 201) {
          await response.json()
          setLocalSettings(settings);
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
      }
    }
  };
  const onChangeAdditionalPizzaLeadTime = (e: number) => {
    setLocalSettings({ ...localSettings, additional_pizza_lead_time: e });
  }

  return (
    <div>
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Fulfillment"}
        onClose={() => setIsFulfillmentEditOpen(false)}
        open={isFulfillmentEditOpen}
        innerComponent={
          fulfillmentToEdit !== null && 
          <FulfillmentEditContainer
            onCloseCallback={() => setIsFulfillmentEditOpen(false)}
            fulfillment={fulfillmentToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Fulfillment"}
        onClose={() => setIsFulfillmentDeleteOpen(false)}
        open={isFulfillmentDeleteOpen}
        innerComponent={
          fulfillmentToEdit !== null && 
          <FulfillmentDeleteContainer
            onCloseCallback={() => setIsFulfillmentDeleteOpen(false)}
            fulfillment={fulfillmentToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Add Fulfillment"}
        onClose={() => setIsFulfillmentAddOpen(false)}
        open={isFulfillmentAddOpen}
        innerComponent={
          <FulfillmentAddContainer
            onCloseCallback={() => setIsFulfillmentAddOpen(false)}
          />
        }
      />
      <Card>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <FulfillmentTableContainer
              setIsFulfillmentAddOpen={setIsFulfillmentAddOpen}
              setIsFulfillmentDeleteOpen={setIsFulfillmentDeleteOpen}
              setIsFulfillmentEditOpen={setIsFulfillmentEditOpen}
              setFulfillmentToEdit={setFulfillmentToEdit}
            />
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}


export default SettingsComponent;