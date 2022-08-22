import { useState } from 'react';
import { Card, Grid } from '@mui/material';

import { FulfillmentConfig } from "@wcp/wcpshared";
import { DialogContainer } from '@wcp/wario-ux-shared';
import FulfillmentAddContainer from './FulfillmentAddContainer';
import FulfillmentEditContainer from './FulfillmentEditContainer';
import FulfillmentDeleteContainer from './FulfillmentDeleteContainer';
import FulfillmentTableContainer from './FulfillmentTableContainer';

const SettingsComponent = () => {
  const [fulfillmentToEdit, setFulfillmentToEdit] = useState<FulfillmentConfig|null>(null);
  const [isFulfillmentAddOpen, setIsFulfillmentAddOpen] = useState(false);
  const [isFulfillmentEditOpen, setIsFulfillmentEditOpen] = useState(false);
  const [isFulfillmentDeleteOpen, setIsFulfillmentDeleteOpen] = useState(false);

  return (
    <>
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
    </>
  );
}


export default SettingsComponent;