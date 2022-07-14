// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import LeadTimesComp from "../../components/wario/leadtimes.component";
import BlockOffComp from "../../components/wario/blockoff.component";

// ----------------------------------------------------------------------

export default function GeneralTiming() {

  const { themeStretch } = useSettings();

  return (
    <Page title="Order Timing">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={12}>
            <LeadTimesComp />
          </Grid>
          <BlockOffComp />
        </Grid>
      </Container>
    </Page>
  );
}
