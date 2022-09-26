import { useState, useMemo } from "react";

import Grid from "@mui/material/Grid";
import { DialogContainer } from "@wcp/wario-ux-shared";

import ProductInstanceFunctionAddContainer from "./product_instance_function/product_instance_function.add.container";
import ProductInstanceFunctionEditContainer from "./product_instance_function/product_instance_function.edit.container";
import ProductInstanceFunctionDeleteContainer from "./product_instance_function/product_instance_function.delete.container";
import CategoryTableContainer from "./category/category_table.container";
import ModifierTypeTableContainer from "./modifier_type/modifier_type_table.container";
import ProductTableContainer from "./product/product_table.container";
import ProductInstanceFunctionTableContainer from "./product_instance_function/product_instance_function_table.container";

import { useAppSelector } from "../../../hooks/useRedux";

const MenuBuilderComponent = () => {
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
  );
};

export default MenuBuilderComponent;
