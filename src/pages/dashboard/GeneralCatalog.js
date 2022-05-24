// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useSocketIo from '../../hooks/useSocketIo';
// components
import Page from '../../components/Page';
// sections
import MenuBuilderComponent from "../../components/wario/menu/menu_builder.component";

import {HOST_API} from '../../config';

// ----------------------------------------------------------------------

export default function GeneralCatalog() {

  const { catalog } = useSocketIo();

  const { themeStretch } = useSettings();

  return (
    <Page title="Catalog Management">
      <Container maxWidth={themeStretch ? false : 'xl'}>
          <Grid item xs={12} md={12}>
            <MenuBuilderComponent ENDPOINT={HOST_API} catalog={catalog} />
          </Grid>
      </Container>
    </Page>
  );
}
