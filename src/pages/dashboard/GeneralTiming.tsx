// @mui
import { Container, Grid } from '@mui/material';

// components
import { Page } from '../../components/Page';
// sections
import { BlockOffComp } from "../../components/wario/blockoff.component";
import { LeadTimesComp } from "../../components/wario/leadtimes.component";
import { useAppSelector } from '../../hooks/useRedux';
// hooks
import { useSettings } from '../../hooks/useSettings';

// ----------------------------------------------------------------------

export const GeneralTiming = () => {
  const FULFILLMENTS = useAppSelector(s => s.ws.fulfillments);

  const { themeStretch } = useSettings();

  return (
    <Page title="Order Timing">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        {!FULFILLMENTS || Object.keys(FULFILLMENTS).length === 0 ? "Please add some fulfillment configuration first" :
          (
            <Grid container spacing={3}>
              <Grid
                size={{
                  xs: 12,
                  md: 12
                }}>
                <LeadTimesComp />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  md: 12
                }}>
                <BlockOffComp />
              </Grid>
            </Grid>)}
      </Container>
    </Page>
  );
}

export default GeneralTiming;