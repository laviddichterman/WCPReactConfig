import React, { useMemo } from 'react';
// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { useAppSelector } from '../../hooks/useRedux';

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

const CategoryDialoguesContainer = React.lazy(() => import("../../components/wario/menu/category_dialogues.container"));
const ModifierDialoguesContainer = React.lazy(() => import("../../components/wario/menu/modifier_dialogues.container"));
const CategoryTableContainer = React.lazy(() => import("../../components/wario/menu/category/category_table.container"));
const ModifierTypeTableContainer = React.lazy(() => import("../../components/wario/menu/modifier_type/modifier_type_table.container"));
const ProductTableContainer = React.lazy(() => import("../../components/wario/menu/product/product_table.container"));
const ProductInstanceFunctionTableContainer = React.lazy(() => import("../../components/wario/menu/product_instance_function/product_instance_function_table.container"));
const PrinterGroupTableContainer = React.lazy(() => import("../../components/wario/menu/printer_group/PrinterGroupTableContainer"));
