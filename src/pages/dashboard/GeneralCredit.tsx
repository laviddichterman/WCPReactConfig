// @mui
import { Container, Grid } from '@mui/material';
// hooks
import { useSettings } from '../../hooks/useSettings';
// components
import { Page } from '../../components/Page';
// sections
import React from 'react';
const StoreCreditIssueComponent = React.lazy(() => import('../../components/wario/store_credit_issue.component'));
const StoreCreditValidateAndSpendComponent = React.lazy(() => import('../../components/wario/store_credit_validate_and_spend.component'));

// ----------------------------------------------------------------------

export default function GeneralCredit() {

  const { themeStretch } = useSettings();
  return (
    <Page title="Store Credit Issuance and Redemption">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={6}>
          <Grid size={12}>
            <StoreCreditIssueComponent />
          </Grid>
          <Grid size={12}>
            <StoreCreditValidateAndSpendComponent />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}


