// @mui
import { Grid, Container, Stack, Card, CardHeader, } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import Scrollbar from '../../components/Scrollbar';
import StoreCreditIssueComponent from "../../components/wario/store_credit_issue.component";
import StoreCreditValidateAndSpendComponent from "../../components/wario/store_credit_validate_and_spend.component";

import {HOST_API} from '../../config';

// ----------------------------------------------------------------------



const CardWrapper = ({ title, subheader, action, children, ...other }) => (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} action={action}  sx={{ mb: 3 }} />
      <Scrollbar>
        {children}
      </Scrollbar>
    </Card>
  );


export default function GeneralCredit() {

  const { themeStretch } = useSettings();
  return (
    <Page title="Store Credit Issuance and Redemption">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} >
           <CardWrapper >
              <StoreCreditIssueComponent ENDPOINT={HOST_API} />

            </CardWrapper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <StoreCreditValidateAndSpendComponent ENDPOINT={HOST_API} />
            </Stack>
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
