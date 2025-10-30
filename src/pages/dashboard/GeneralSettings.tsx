// @mui
import { Container, Grid } from '@mui/material';

// components
import { Page } from '../../components/Page';
// sections
import { KeyValuesComponent } from "../../components/wario/keyvalues.component";
import { SettingsComponent } from "../../components/wario/settings.component";
import { StoreSettingsComponent } from "../../components/wario/store_settings.component";
// hooks
import { useSettings } from '../../hooks/useSettings';

// ----------------------------------------------------------------------

export default function GeneralSettings() {

  const { themeStretch } = useSettings();

  return (
    <Page title="WARIO Store Settings">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              md: 12
            }}>
            <SettingsComponent />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 12
            }}>
            <StoreSettingsComponent />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 12
            }}>
            <KeyValuesComponent />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
