import React, { useMemo, useState } from 'react';
// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { DialogContainer } from "@wcp/wario-ux-shared";
import { useAppSelector } from '../../hooks/useRedux';

export default function GeneralCatalog() {
  const { themeStretch } = useSettings();
  const catalog = useAppSelector(s => s.ws.catalog!);

  const [isProductInstanceFunctionAddOpen, setIsProductInstanceFunctionAddOpen] = useState(false);
  const [isProductInstanceFunctionDeleteOpen, setIsProductInstanceFunctionDeleteOpen] = useState(false);
  const [isProductInstanceFunctionEditOpen, setIsProductInstanceFunctionEditOpen] = useState(false);
  const [pifIdToEdit, setPifIdToEdit] = useState<string | null>(null);

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
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid item xs={12} md={12}>
          <div>
            <DialogContainer
              maxWidth={"xl"}
              title={"Add Product Instance Function"}
              onClose={() => setIsProductInstanceFunctionAddOpen(false)}
              open={isProductInstanceFunctionAddOpen}
              innerComponent={
                <ProductInstanceFunctionAddContainer
                  onCloseCallback={() => setIsProductInstanceFunctionAddOpen(false)}
                />
              }
            />
            <DialogContainer
              maxWidth={"xl"}
              title={"Edit Product Instance Function"}
              onClose={() => setIsProductInstanceFunctionEditOpen(false)}
              open={isProductInstanceFunctionEditOpen}
              innerComponent={
                pifIdToEdit !== null &&
                <ProductInstanceFunctionEditContainer
                  onCloseCallback={() => setIsProductInstanceFunctionEditOpen(false)}
                  pifId={pifIdToEdit}
                />
              }
            />
            <DialogContainer
              title={"Delete Product Instance Function"}
              onClose={() => {
                setIsProductInstanceFunctionDeleteOpen(false);
              }}
              open={isProductInstanceFunctionDeleteOpen}
              innerComponent={
                pifIdToEdit !== null &&
                <ProductInstanceFunctionDeleteContainer
                  onCloseCallback={() => {
                    setIsProductInstanceFunctionDeleteOpen(false);
                  }}
                  pifId={pifIdToEdit}
                />
              }
            />
            <Grid container justifyContent="center" spacing={3}>
              <Grid item xs={12}>
                <CategoryTableContainer />
              </Grid>
              {orphanedProducts.length > 0 ? (
                <Grid item xs={12}>
                  <ProductTableContainer
                    products={orphanedProducts}
                    setPanelsExpandedSize={() => (0)} // no need for the panels expanded size here... i don't think
                  />
                </Grid>
              ) : (
                ""
              )}
              <Grid item xs={12}>
                <ModifierTypeTableContainer />
              </Grid>
              <Grid item xs={12}>
                <ProductInstanceFunctionTableContainer
                  setIsProductInstanceFunctionEditOpen={setIsProductInstanceFunctionEditOpen}
                  setIsProductInstanceFunctionDeleteOpen={setIsProductInstanceFunctionDeleteOpen}
                  setIsProductInstanceFunctionAddOpen={setIsProductInstanceFunctionAddOpen}
                  setPifIdToEdit={setPifIdToEdit}
                />
              </Grid>
            </Grid>
            <br />
          </div>
        </Grid>
      </Container>
    </Page>
  );
}


const CategoryTableContainer = React.lazy(() => import("../../components/wario/menu/category/category_table.container"));
const ProductInstanceFunctionDeleteContainer = React.lazy(() => import("../../components/wario/menu/product_instance_function/product_instance_function.delete.container"));
const ProductInstanceFunctionEditContainer = React.lazy(() => import("../../components/wario/menu/product_instance_function/product_instance_function.edit.container"));
const ModifierTypeTableContainer = React.lazy(() => import("../../components/wario/menu/modifier_type/modifier_type_table.container"));
const ProductTableContainer = React.lazy(() => import("../../components/wario/menu/product/product_table.container"));
const ProductInstanceFunctionTableContainer = React.lazy(() => import("../../components/wario/menu/product_instance_function/product_instance_function_table.container"));
const ProductInstanceFunctionAddContainer = React.lazy(() => import("../../components/wario/menu/product_instance_function/product_instance_function.add.container"));
