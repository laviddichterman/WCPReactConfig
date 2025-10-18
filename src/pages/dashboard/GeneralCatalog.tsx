// @mui
import { Container, Grid } from '@mui/material';
// hooks
import { useSettings } from '../../hooks/useSettings';
// components
import { Page } from '../../components/Page';
import CatalogTableContainer from '../../components/wario/menu/category/catalog_table.container';
import CategoryDialoguesContainer from '../../components/wario/menu/category_dialogues.container';
import ModifierDialoguesContainer from '../../components/wario/menu/modifier_dialogues.container';
import ModifierTypeTableContainer from '../../components/wario/menu/modifier_type/modifier_type_table.container';
import PrinterGroupTableContainer from '../../components/wario/menu/printer_group/PrinterGroupTableContainer';
import ProductTableContainer from '../../components/wario/menu/product/product_table.container';
import ProductInstanceFunctionTableContainer from '../../components/wario/menu/product_instance_function/product_instance_function_table.container';
import { useAppSelector } from '../../hooks/useRedux';
import { selectOrphanedProductIds } from '../../redux/store';

export default function GeneralCatalog() {
  const { themeStretch } = useSettings();
  const isCatalogLoaded = useAppSelector(s => s.ws.catalog !== null);
  const orphanedProductIds = useAppSelector(s => selectOrphanedProductIds(s));

  if (!isCatalogLoaded) {
    return <>Loading...</>;
  }
  return (
    <Page title="Catalog Management">
      <CategoryDialoguesContainer />
      <ModifierDialoguesContainer />
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid
          size={{
            xs: 12,
            md: 12
          }}>
          <Grid container justifyContent="center" spacing={3}>
            <Grid size={12}>
              <CatalogTableContainer />
            </Grid>
            {orphanedProductIds.length > 0 && (
              <Grid size={12}>
                <ProductTableContainer
                  disableToolbar={false}
                  title={"Products without a category"}
                  pagination={true}
                  product_ids={orphanedProductIds}
                  setPanelsExpandedSize={() => (0)} // no need for the panels expanded size here... i don't think
                />
              </Grid>
            )}
            <Grid size={12}>
              <ModifierTypeTableContainer />
            </Grid>
            <Grid size={12}>
              <ProductInstanceFunctionTableContainer />
            </Grid>
            <Grid size={12}>
              <PrinterGroupTableContainer />
            </Grid>
          </Grid>
          <br />
        </Grid>
      </Container>
    </Page>
  );
}