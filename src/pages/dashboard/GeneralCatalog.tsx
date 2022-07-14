// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import MenuBuilderComponent from "../../components/wario/menu/menu_builder.component";

// ----------------------------------------------------------------------

export default function GeneralCatalog() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Catalog Management">
      <Container maxWidth={themeStretch ? false : 'xl'}>
          <Grid item xs={12} md={12}>
            <MenuBuilderComponent />
          </Grid>
      </Container>
    </Page>
  );
}
