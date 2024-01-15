import { useMemo } from 'react';
// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { useAppSelector } from '../../hooks/useRedux';
import ProductTableContainer from '../../components/wario/menu/product/product_table.container';
import CategoryDialoguesContainer from '../../components/wario/menu/category_dialogues.container';
import ModifierDialoguesContainer from '../../components/wario/menu/modifier_dialogues.container';
import CategoryTableContainer from '../../components/wario/menu/category/category_table.container';
import ModifierTypeTableContainer from '../../components/wario/menu/modifier_type/modifier_type_table.container';
import ProductInstanceFunctionTableContainer from '../../components/wario/menu/product_instance_function/product_instance_function_table.container';
import PrinterGroupTableContainer from '../../components/wario/menu/printer_group/PrinterGroupTableContainer';

export default function GeneralCatalog() {
  const { themeStretch } = useSettings();
  const catalog = useAppSelector(s => s.ws.catalog!);
  const orphanedProducts = useMemo(
    () =>
      catalog !== null ? Object.values(catalog.products).filter(
        (x) =>
          x.product.category_ids.filter((x) => x && x.length > 0).length === 0
      ) : [],
    [catalog]
  );

  if (catalog === null) {
    return <>Loading...</>;
  }
  return (
    <Page title="Catalog Management">
      <CategoryDialoguesContainer />
      <ModifierDialoguesContainer />
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid item xs={12} md={12}>
          <Grid container justifyContent="center" spacing={3}>
            <Grid item xs={12}>
              <CategoryTableContainer />
            </Grid>
            {orphanedProducts.length > 0 && (
              <Grid item xs={12}>
                <ProductTableContainer
                  disableToolbar={false}
                  title={"Products without a category"}
                  pagination={true}
                  products={orphanedProducts}
                  setPanelsExpandedSize={() => (0)} // no need for the panels expanded size here... i don't think
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <ModifierTypeTableContainer />
            </Grid>
            <Grid item xs={12}>
              <ProductInstanceFunctionTableContainer />
            </Grid>
            <Grid item xs={12}>
              <PrinterGroupTableContainer />
            </Grid>
          </Grid>
          <br />
        </Grid>
      </Container>
    </Page>
  );
}