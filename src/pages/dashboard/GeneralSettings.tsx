// @mui
import { Container, Grid } from '@mui/material';
// hooks
import { useSettings } from '../../hooks/useSettings';
// components
import { Page } from '../../components/Page';
// sections
import { KeyValuesComponent } from "../../components/wario/keyvalues.component";
import { SettingsComponent } from "../../components/wario/settings.component";
import { StoreSettingsComponent } from "../../components/wario/store_settings.component";

// ----------------------------------------------------------------------

export default function GeneralSettings() {

  const { themeStretch } = useSettings();

  return (
    <Page title="WARIO Store Settings">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <SettingsComponent />
          </Grid>
          <Grid item xs={12} md={12}>
            <StoreSettingsComponent />
          </Grid>
          <Grid item xs={12} md={12}>
            <KeyValuesComponent />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
