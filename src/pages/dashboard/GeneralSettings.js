// @mui
import { Grid, Container } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useSocketIo from '../../hooks/useSocketIo';
// components
import Page from '../../components/Page';
// sections
import SettingsComp from "../../components/wario/settings.component";
import DeliveryAreaComp from "../../components/wario/deliveryarea.component";
import KeyValuesComponent from "../../components/wario/keyvalues.component";

import {HOST_API} from '../../config';


// ----------------------------------------------------------------------

export default function GeneralSettings() {

  const { services, settings, deliveryArea } = useSocketIo();

  const { themeStretch } = useSettings();
console.log(services);
  return (
    <Page title="WARIO Store Settings">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>




          <Grid item xs={12} md={12}>
            {services !== undefined && settings !== undefined ? (<SettingsComp
                ENDPOINT={HOST_API}
              />) : ""}
          </Grid>

          <Grid item xs={12} md={12}>
          <DeliveryAreaComp
              ENDPOINT={HOST_API}
              DELIVERY_AREA={deliveryArea}
              onChange={e => (e)}
            />
          </Grid>

          <Grid item xs={12} md={12}>
          <KeyValuesComponent
              ENDPOINT={HOST_API}
            />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
