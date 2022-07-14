import React, { useState, useMemo } from "react";

import Grid from "@mui/material/Grid";
import InterstitialDialog from "../interstitial.dialog.component";
import DialogContainer from "../dialog.container";
import CategoryAddContainer from "./category.add.container";
import CategoryEditContainer from "./category.edit.container";
import CategoryDeleteContainer from "./category.delete.container";
import ModifierTypeAddContainer from "./modifier_type.add.container";
import ModifierTypeEditContainer from "./modifier_type.edit.container";
import ModifierTypeDeleteContainer from "./modifier_type.delete.container";
import ModifierOptionAddContainer from "./modifier_option.add.container";
import ModifierOptionEditContainer from "./modifier_option.edit.container";
import ModifierOptionDeleteContainer from "./modifier_option.delete.container";
import ModifierOptionEnableContainer from "./modifier_option.enable.container";
import ModifierOptionDisableContainer from "./modifier_option.disable.container";
import ModifierOptionDisableUntilEodContainer from "./modifier_option.disable_until_eod.container";
import ProductAddContainer from "./product.add.container";
import ProductImportContainer from "./product.import.container";
import ProductEditContainer from "./product.edit.container";
import ProductCopyContainer from "./product.copy.container";
import ProductDeleteContainer from "./product.delete.container";
import ProductDisableUntilEodContainer from "./product.disable_until_eod.container";
import ProductDisableContainer from "./product.disable.container";
import ProductEnableContainer from "./product.enable.container";
import ProductInstanceAddContainer from "./product_instance.add.container";
import ProductInstanceEditContainer from "./product_instance.edit.container";
import ProductInstanceDeleteContainer from "./product_instance.delete.container";
import ProductInstanceFunctionAddContainer from "./product_instance_function.add.container";
import ProductInstanceFunctionEditContainer from "./product_instance_function.edit.container";
import ProductInstanceFunctionDeleteContainer from "./product_instance_function.delete.container";
import CategoryTableContainer from "./category_table.container";
import ModifierTypeTableContainer from "./modifier_type_table.container";
import ProductTableContainer from "./product_table.container";
import ProductInstanceFunctionTableContainer from "./product_instance_function_table.container";

import { HOST_API } from "../../../config";
import { useAppSelector } from "../../../hooks/useRedux";
import { ICatalog, ICategory, IOption, IOptionType, IProduct, IProductInstance, IProductInstanceFunction } from "@wcp/wcpshared";

const MenuBuilderComponent = () => {
  const catalog = useAppSelector(s=>s.ws.catalog);
  const services = useAppSelector(s=>s.ws.services);
  const [isModifierTypeAddOpen, setIsModifierTypeAddOpen] = useState(false);
  const [isModifierTypeEditOpen, setIsModifierTypeEditOpen] = useState(false);
  const [isModifierTypeDeleteOpen, setIsModifierTypeDeleteOpen] = useState(false);

  const [isModifierOptionAddOpen, setIsModifierOptionAddOpen] = useState(false);
  const [isModifierOptionEditOpen, setIsModifierOptionEditOpen] = useState(false);
  const [isModifierOptionDeleteOpen, setIsModifierOptionDeleteOpen] = useState(false);
  const [isModifierOptionEnableOpen, setIsModifierOptionEnableOpen] = useState(false);
  const [isModifierOptionDisableOpen, setIsModifierOptionDisableOpen] = useState(false);
  const [isModifierOptionDisableUntilEodOpen, setIsModifierOptionDisableUntilEodOpen] = useState(false);

  const [modifierTypeToEdit, setModifierTypeToEdit] = useState<IOptionType | null>(null);
  const [modifierOptionToEdit, setModifierOptionToEdit] = useState<IOption | null>(null);

  const [isCategoryInterstitialOpen, setIsCategoryInterstitialOpen] = useState(false);
  const [isCategoryAddOpen, setIsCategoryAddOpen] = useState(false);
  const [isProductAddOpen, setIsProductAddOpen] = useState(false);
  const [isProductImportOpen, setIsProductImportOpen] = useState(false);
  const [isProductCopyOpen, setIsProductCopyOpen] = useState(false);
  const [isProductDeleteOpen, setIsProductDeleteOpen] = useState(false);

  const [isProductInstanceAddOpen, setIsProductInstanceAddOpen] = useState(false);
  const [isProductInstanceDeleteOpen, setIsProductInstanceDeleteOpen] = useState(false);

  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false);
  const [isCategoryDeleteOpen, setIsCategoryDeleteOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);

  const [isProductEditOpen, setIsProductEditOpen] = useState(false);
  const [isProductDisableUntilEodOpen, setIsProductDisableUntilEodOpen] = useState(false);
  const [isProductDisableOpen, setIsProductDisableOpen] = useState(false);
  const [isProductEnableOpen, setIsProductEnableOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);

  const [isProductInstanceEditOpen, setIsProductInstanceEditOpen] = useState(false);
  const [productInstanceToEdit, setProductInstanceToEdit] = useState<IProductInstance|null>(null);

  const [isProductInstanceFunctionAddOpen, setIsProductInstanceFunctionAddOpen] = useState(false);
  const [isProductInstanceFunctionDeleteOpen, setIsProductInstanceFunctionDeleteOpen] = useState(false);
  const [isProductInstanceFunctionEditOpen, setIsProductInstanceFunctionEditOpen] = useState(false);
  const [productInstanceFunctionToEdit, setProductInstanceFunctionToEdit] = useState<IProductInstanceFunction | null>(null);

  // this assumes a single base product instance per product class.
  // assumption is that this precondition is enforced by the service
  const nameOfBaseProductInstance = useMemo(() => {
    const pididx = productToEdit !== null && catalog !== null && Object.hasOwn(catalog.products, productToEdit.id) ? catalog.products[productToEdit.id].instances.findIndex((pi) => pi.is_base) : -1;
    return pididx !== -1 ? (catalog as ICatalog).products[(productToEdit as IProduct).id].instances[pididx].item.display_name : "Incomplete Product";
  }, [catalog?.products, productToEdit]);


  const orphanedProducts = useMemo(
    () =>
      catalog !== null ? Object.values(catalog.products).filter(
        (x) =>
          x.product.category_ids.filter((x) => x && x.length > 0).length === 0
      ) : [],
    [catalog?.products]
  );

  if (catalog === null) {
    return <>Loading...</>;
  }

  return (
    <div>
      <DialogContainer
        title={"Edit Category"}
        onClose={() => setIsCategoryEditOpen(false)}
        open={isCategoryEditOpen}
        inner_component={
          <CategoryEditContainer
            onCloseCallback={() => setIsCategoryEditOpen(false)}
            categories={catalog.categories}
            ENDPOINT={HOST_API}
            category={categoryToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Category"}
        onClose={() => setIsCategoryDeleteOpen(false)}
        open={isCategoryDeleteOpen}
        inner_component={
          <CategoryDeleteContainer
            onCloseCallback={() => setIsCategoryDeleteOpen(false)}
            ENDPOINT={HOST_API}
            category={categoryToEdit}
          />
        }
      />
      <DialogContainer
        title={"Add Modifier Type"}
        onClose={() => setIsModifierTypeAddOpen(false)}
        open={isModifierTypeAddOpen}
        inner_component={
          <ModifierTypeAddContainer
            onCloseCallback={() => setIsModifierTypeAddOpen(false)}
            ENDPOINT={HOST_API}
          />
        }
      />
      <DialogContainer
        title={"Edit Modifier Type"}
        onClose={() => setIsModifierTypeEditOpen(false)}
        open={isModifierTypeEditOpen}
        inner_component={
          <ModifierTypeEditContainer
            onCloseCallback={() => setIsModifierTypeEditOpen(false)}
            modifier_type={modifierTypeToEdit}
            ENDPOINT={HOST_API}
          />
        }
      />
      <DialogContainer
        title={"Delete Modifier Type"}
        onClose={() => setIsModifierTypeDeleteOpen(false)}
        open={isModifierTypeDeleteOpen}
        inner_component={
          <ModifierTypeDeleteContainer
            onCloseCallback={() => setIsModifierTypeDeleteOpen(false)}
            ENDPOINT={HOST_API}
            modifier_type={modifierTypeToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={`Add Modifier Option for Type: ${modifierTypeToEdit?.name ?? ""}`}
        onClose={() => setIsModifierOptionAddOpen(false)}
        open={isModifierOptionAddOpen}
        inner_component={
          <ModifierOptionAddContainer
            onCloseCallback={() => setIsModifierOptionAddOpen(false)}
            product_instance_functions={catalog.product_instance_functions}
            ENDPOINT={HOST_API}
            parent={modifierTypeToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Modifier Option"}
        onClose={() => setIsModifierOptionEditOpen(false)}
        open={isModifierOptionEditOpen}
        inner_component={
          <ModifierOptionEditContainer
            onCloseCallback={() => setIsModifierOptionEditOpen(false)}
            product_instance_functions={catalog.product_instance_functions}
            modifier_option={modifierOptionToEdit}
            modifier_types={catalog.modifiers}
            ENDPOINT={HOST_API}
          />
        }
      />
      <DialogContainer
        title={"Disable Modifier Option Until End-of-Day"}
        onClose={() => setIsModifierOptionDisableUntilEodOpen(false)}
        open={isModifierOptionDisableUntilEodOpen}
        inner_component={
          <ModifierOptionDisableUntilEodContainer
            onCloseCallback={() => setIsModifierOptionDisableUntilEodOpen(false)}
            ENDPOINT={HOST_API}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        title={"Disable Modifier Option"}
        onClose={() => setIsModifierOptionDisableOpen(false)}
        open={isModifierOptionDisableOpen}
        inner_component={
          <ModifierOptionDisableContainer
            onCloseCallback={() => setIsModifierOptionDisableOpen(false)}
            ENDPOINT={HOST_API}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        title={"Enable Modifier Option"}
        onClose={() => setIsModifierOptionEnableOpen(false)}
        open={isModifierOptionEnableOpen}
        inner_component={
          <ModifierOptionEnableContainer
            onCloseCallback={() => setIsModifierOptionEnableOpen(false)}
            ENDPOINT={HOST_API}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Modifier Option"}
        onClose={() => setIsModifierOptionDeleteOpen(false)}
        open={isModifierOptionDeleteOpen}
        inner_component={
          <ModifierOptionDeleteContainer
            onCloseCallback={() => setIsModifierOptionDeleteOpen(false)}
            ENDPOINT={HOST_API}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Product"}
        onClose={() => setIsProductEditOpen(false)}
        open={isProductEditOpen}
        inner_component={
          <ProductEditContainer
            onCloseCallback={() => setIsProductEditOpen(false)}
            services={services}
            categories={catalog.categories}
            modifier_types={catalog.modifiers}
            product_instance_functions={catalog.product_instance_functions}
            product={productToEdit}
            ENDPOINT={HOST_API}
          />
        }
      />
      <DialogContainer
        title={"Disable Product Until End-of-Day"}
        onClose={() => setIsProductDisableUntilEodOpen(false)}
        open={isProductDisableUntilEodOpen}
        inner_component={
          <ProductDisableUntilEodContainer
            onCloseCallback={() => setIsProductDisableUntilEodOpen(false)}
            product={productToEdit}
            productName={nameOfBaseProductInstance}
            ENDPOINT={HOST_API}
          />
        }
      />
      <DialogContainer
        title={"Disable Product"}
        onClose={() => setIsProductDisableOpen(false)}
        open={isProductDisableOpen}
        inner_component={
          <ProductDisableContainer
            onCloseCallback={() => setIsProductDisableOpen(false)}
            productName={nameOfBaseProductInstance}
            product={productToEdit}
            ENDPOINT={HOST_API}
          />
        }
      />
      <DialogContainer
        title={"Enable Product"}
        onClose={() => setIsProductEnableOpen(false)}
        open={isProductEnableOpen}
        inner_component={
          <ProductEnableContainer
            onCloseCallback={() => setIsProductEnableOpen(false)}
            product={productToEdit}
            productName={nameOfBaseProductInstance}
            ENDPOINT={HOST_API}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Copy Product"}
        onClose={() => setIsProductCopyOpen(false)}
        open={isProductCopyOpen}
        inner_component={
          <ProductCopyContainer
            onCloseCallback={() => setIsProductCopyOpen(false)}
            services={services}
            categories={catalog.categories}
            modifier_types={catalog.modifiers}
            product_instance_functions={catalog.product_instance_functions}
            products={catalog.products}
            product={productToEdit}
            ENDPOINT={HOST_API}
          />
        }
      />
      <DialogContainer
        title={"Delete Product"}
        onClose={() => setIsProductDeleteOpen(false)}
        open={isProductDeleteOpen}
        inner_component={
          <ProductDeleteContainer
            onCloseCallback={() => setIsProductDeleteOpen(false)}
            ENDPOINT={HOST_API}
            productName={nameOfBaseProductInstance}
            product={productToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={`Add Product Instance for: ${nameOfBaseProductInstance}`}
        onClose={() => setIsProductInstanceAddOpen(false)}
        open={isProductInstanceAddOpen}
        inner_component={
          <ProductInstanceAddContainer
            onCloseCallback={() => setIsProductInstanceAddOpen(false)}
            modifier_types_map={catalog.modifiers}
            parent_product={productToEdit}
            ENDPOINT={HOST_API}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Product Instance"}
        onClose={() => setIsProductInstanceEditOpen(false)}
        open={isProductInstanceEditOpen}
        inner_component={
          <ProductInstanceEditContainer
            onCloseCallback={() => setIsProductInstanceEditOpen(false)}
            modifier_types_map={catalog.modifiers}
            parent_product={productToEdit}
            product_instance={productInstanceToEdit}
            ENDPOINT={HOST_API}
          />
        }
      />
      <DialogContainer
        title={"Delete Product Instance"}
        onClose={() => setIsProductInstanceDeleteOpen(false)}
        open={isProductInstanceDeleteOpen}
        inner_component={
          <ProductInstanceDeleteContainer
            onCloseCallback={() => setIsProductInstanceDeleteOpen(false)}
            ENDPOINT={HOST_API}
            product_instance={productInstanceToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Add Product Instance Function"}
        onClose={() => setIsProductInstanceFunctionAddOpen(false)}
        open={isProductInstanceFunctionAddOpen}
        inner_component={
          <ProductInstanceFunctionAddContainer
            onCloseCallback={() => setIsProductInstanceFunctionAddOpen(false)}
            modifier_types={catalog.modifiers}
            ENDPOINT={HOST_API}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Product Instance Function"}
        onClose={() => setIsProductInstanceFunctionEditOpen(false)}
        open={isProductInstanceFunctionEditOpen}
        inner_component={
          <ProductInstanceFunctionEditContainer
            onCloseCallback={() => setIsProductInstanceFunctionEditOpen(false)}
            modifier_types={catalog.modifiers}
            product_instance_function={productInstanceFunctionToEdit}
            ENDPOINT={HOST_API}
          />
        }
      />
      <DialogContainer
        title={"Delete Product Instance Function"}
        onClose={() => {
          setIsProductInstanceFunctionDeleteOpen(false);
        }}
        open={isProductInstanceFunctionDeleteOpen}
        inner_component={
          <ProductInstanceFunctionDeleteContainer
            onCloseCallback={() => {
              setIsProductInstanceFunctionDeleteOpen(false);
            }}
            ENDPOINT={HOST_API}
            product_instance_function={productInstanceFunctionToEdit}
          />
        }
      />
      <Grid container justifyContent="center" spacing={3}>
        <Grid item xs={12}>
          <InterstitialDialog
            dialogTitle={"Add new..."}
            options={[
              {
                title: "Add Category",
                cb: () => {
                  setIsCategoryAddOpen(true);
                },
                open: isCategoryAddOpen,
                onClose: () => setIsCategoryAddOpen(false),
                component: (
                  <CategoryAddContainer
                    onCloseCallback={() => {
                      setIsCategoryAddOpen(false);
                    }}
                    ENDPOINT={HOST_API}
                    categories={catalog.categories}
                  />
                ),
              },
              {
                title: "Add Product",
                cb: () => setIsProductAddOpen(true),
                open: isProductAddOpen,
                onClose: () => setIsProductAddOpen(false),
                component: (
                  <ProductAddContainer
                    ENDPOINT={HOST_API}
                    onCloseCallback={() => {
                      setIsProductAddOpen(false);
                    }}
                    services={services}
                    categories={catalog.categories}
                    modifier_types={catalog.modifiers}
                    product_instance_functions={catalog.product_instance_functions}
                  />
                ),
              },
              {
                title: "Import Products",
                cb: () => setIsProductImportOpen(true),
                open: isProductImportOpen,
                onClose: () => setIsProductImportOpen(false),
                component: (
                  <ProductImportContainer
                    ENDPOINT={HOST_API}
                    onCloseCallback={() => {
                      setIsProductImportOpen(false);
                    }}
                    categories={catalog.categories}
                    modifier_types={catalog.modifiers}
                    product_instance_functions={catalog.product_instance_functions}
                  />
                ),
              },
            ]}
            onClose={() => setIsCategoryInterstitialOpen(false)}
            open={isCategoryInterstitialOpen}
          />
          <CategoryTableContainer
            catalog={catalog}
            setIsCategoryInterstitialOpen={setIsCategoryInterstitialOpen}
            setIsCategoryDeleteOpen={setIsCategoryDeleteOpen}
            setIsCategoryEditOpen={setIsCategoryEditOpen}
            setCategoryToEdit={setCategoryToEdit}
            setProductToEdit={setProductToEdit}
            setIsProductEditOpen={setIsProductEditOpen}
            setIsProductCopyOpen={setIsProductCopyOpen}
            setIsProductDeleteOpen={setIsProductDeleteOpen}
            setIsProductDisableOpen={setIsProductDisableOpen}
            setIsProductDisableUntilEodOpen={setIsProductDisableUntilEodOpen}
            setIsProductEnableOpen={setIsProductEnableOpen}
            setIsProductInstanceAddOpen={setIsProductInstanceAddOpen}
            setIsProductInstanceEditOpen={setIsProductInstanceEditOpen}
            setIsProductInstanceDeleteOpen={setIsProductInstanceDeleteOpen}
            productInstanceToEdit={productInstanceToEdit}
            setProductInstanceToEdit={setProductInstanceToEdit}
          />
        </Grid>
        {orphanedProducts.length > 0 ? (
          <Grid item xs={12}>
            <ProductTableContainer
              products={orphanedProducts}
              setProductToEdit={setProductToEdit}
              setIsProductEditOpen={setIsProductEditOpen}
              setIsProductCopyOpen={setIsProductCopyOpen}
              setIsProductDeleteOpen={setIsProductDeleteOpen}
              setIsProductDisableOpen={setIsProductDisableOpen}
              setIsProductDisableUntilEodOpen={setIsProductDisableUntilEodOpen}
              setIsProductEnableOpen={setIsProductEnableOpen}
              setIsProductInstanceAddOpen={setIsProductInstanceAddOpen}
              setIsProductInstanceEditOpen={setIsProductInstanceEditOpen}
              setIsProductInstanceDeleteOpen={setIsProductInstanceDeleteOpen}
              setProductInstanceToEdit={setProductInstanceToEdit}
              setPanelsExpandedSize={() => (0)} // no need for the panels expanded size here... i don't think
            />
          </Grid>
        ) : (
          ""
        )}
        <Grid item xs={12}>
          <ModifierTypeTableContainer
            modifier_types_map={catalog.modifiers}
            setIsModifierTypeAddOpen={setIsModifierTypeAddOpen}
            setIsModifierTypeEditOpen={setIsModifierTypeEditOpen}
            setIsModifierOptionAddOpen={setIsModifierOptionAddOpen}
            setIsModifierOptionEditOpen={setIsModifierOptionEditOpen}
            setIsModifierOptionEnableOpen={setIsModifierOptionEnableOpen}
            setIsModifierOptionDisableOpen={setIsModifierOptionDisableOpen}
            setIsModifierOptionDisableUntilEodOpen={setIsModifierOptionDisableUntilEodOpen}
            setIsModifierTypeDeleteOpen={setIsModifierTypeDeleteOpen}
            setIsModifierOptionDeleteOpen={setIsModifierOptionDeleteOpen}
            setModifierOptionToEdit={setModifierOptionToEdit}
            setModifierTypeToEdit={setModifierTypeToEdit}
          />
        </Grid>
        <Grid item xs={12}>
          <ProductInstanceFunctionTableContainer
            product_instance_functions={catalog.product_instance_functions}
            setIsProductInstanceFunctionEditOpen={setIsProductInstanceFunctionEditOpen}
            setIsProductInstanceFunctionDeleteOpen={setIsProductInstanceFunctionDeleteOpen}
            setIsProductInstanceFunctionAddOpen={setIsProductInstanceFunctionAddOpen}
            productInstanceFunctionToEdit={productInstanceFunctionToEdit}
            setProductInstanceFunctionToEdit={setProductInstanceFunctionToEdit}
            modifier_types={catalog.modifiers}
          />
        </Grid>
      </Grid>
      <br />
    </div>
  );
};

export default MenuBuilderComponent;
