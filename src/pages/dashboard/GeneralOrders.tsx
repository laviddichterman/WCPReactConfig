// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
//import { useAppSelector } from '../../hooks/useRedux';

// ----------------------------------------------------------------------

export default function GeneralTiming() {

  const { themeStretch } = useSettings();

  return (
    <Page title="Order Management">
      <Container maxWidth={themeStretch ? false : 'xl'}>
      </Container>
    </Page>
  );
}
