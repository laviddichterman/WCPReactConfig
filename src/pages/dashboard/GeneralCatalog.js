// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useSocketIo from '../../hooks/useSocketIo';
// components
import Page from '../../components/Page';
// sections
import MenuBuilderComponent from "../../components/wario/menu/menu_builder.component";
import LoadingScreen from '../../components/LoadingScreen';
import {HOST_API} from '../../config';

// ----------------------------------------------------------------------

export default function GeneralCatalog() {

  const { catalog, services } = useSocketIo();

  const { themeStretch } = useSettings();

  if (!services || !catalog) {
    return <LoadingScreen />
  }

  return (
    <Page title="Catalog Management">
      <Container maxWidth={themeStretch ? false : 'xl'}>
          <Grid item xs={12} md={12}>
            <MenuBuilderComponent ENDPOINT={HOST_API} catalog={catalog} services={services} />
          </Grid>
      </Container>
    </Page>
  );
}
