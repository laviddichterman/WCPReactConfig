// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useSocketIo from '../../hooks/useSocketIo';
// components
import Page from '../../components/Page';
// sections
import LeadTimesComp from "../../components/wario/leadtimes.component";
import BlockOffComp from "../../components/wario/blockoff.component";

import {HOST_API} from '../../config';

// ----------------------------------------------------------------------

export default function GeneralTiming() {
  const { services, blockedOff, leadtime, settings } = useSocketIo();

  const { themeStretch } = useSettings();

  return (
    <Page title="Order Timing">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={12}>
          {leadtime !==undefined && services !== undefined ? <LeadTimesComp
              ENDPOINT={HOST_API}
              LEADTIME={leadtime}
              SERVICES={services}
              setLEADTIME={() => 0}
            /> : ""}
            </Grid>
            {services && blockedOff && leadtime && settings ? <BlockOffComp
              ENDPOINT={HOST_API}
              SERVICES={services}
              BLOCKED_OFF={blockedOff}
              setBLOCKED_OFF={()=>0}
              LEAD_TIME={leadtime}
              SETTINGS={settings}
            /> : "" }
        </Grid>
      </Container>
    </Page>
  );
}
