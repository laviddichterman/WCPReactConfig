// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import LeadTimesComp from "../../components/wario/leadtimes.component";
import BlockOffComp from "../../components/wario/blockoff.component";
import { useAppSelector } from '../../hooks/useRedux';

// ----------------------------------------------------------------------

export default function GeneralTiming() {
  const FULFILLMENTS = useAppSelector(s => s.ws.fulfillments);

  const { themeStretch } = useSettings();

  return (
    <Page title="Order Timing">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        {!FULFILLMENTS || Object.keys(FULFILLMENTS).length === 0 ? "Please add some fulfillment configuration first" :
          (
            <Grid container spacing={8}>
              <Grid item xs={12} md={12}>
                <LeadTimesComp />
              </Grid>
              <Grid item xs={12}>
                <BlockOffComp />
              </Grid>
            </Grid>)}
      </Container>
    </Page>
  );
}
