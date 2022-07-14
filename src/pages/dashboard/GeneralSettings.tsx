// @mui
import { Grid, Container } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import SettingsComp from "../../components/wario/settings.component";
import DeliveryAreaComp from "../../components/wario/deliveryarea.component";
import KeyValuesComponent from "../../components/wario/keyvalues.component";
import LoadingScreen from '../../components/LoadingScreen';

import {HOST_API} from '../../config';


// ----------------------------------------------------------------------

export default function GeneralSettings() {

  const { themeStretch } = useSettings();

  return (
    <Page title="WARIO Store Settings">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <SettingsComp />
          </Grid>
          <Grid item xs={12} md={12}>
            <DeliveryAreaComp/>
          </Grid>
          <Grid item xs={12} md={12}>
            <KeyValuesComponent />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
