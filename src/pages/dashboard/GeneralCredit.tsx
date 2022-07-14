// @mui
import { Grid, Container } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import StoreCreditIssueComponent from "../../components/wario/store_credit_issue.component";
import StoreCreditValidateAndSpendComponent from "../../components/wario/store_credit_validate_and_spend.component";

// ----------------------------------------------------------------------

export default function GeneralCredit() {

  const { themeStretch } = useSettings();
  return (
    <Page title="Store Credit Issuance and Redemption">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={6}>
          <Grid item xs={12} >
            <StoreCreditIssueComponent />
          </Grid>
          <Grid item xs={12}>
            <StoreCreditValidateAndSpendComponent />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
