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

export default function GeneralCredit() {

  const { themeStretch } = useSettings();
  return (
    <Page title="Store Credit Issuance and Redemption">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={6}>
          <Grid item xs={12} >
            <StoreCreditIssueComponent ENDPOINT={HOST_API} />
          </Grid>
          <Grid item xs={12}>
            <StoreCreditValidateAndSpendComponent ENDPOINT={HOST_API} />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
