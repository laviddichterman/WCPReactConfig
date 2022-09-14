import { useState, useMemo } from "react";

import Grid from "@mui/material/Grid";
import type { ICategory, IOption, IOptionType, IProduct, IProductInstance, IProductInstanceFunction } from "@wcp/wcpshared";
import { DialogContainer } from "@wcp/wario-ux-shared";
import InterstitialDialog from "../interstitial.dialog.component";
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

import { useAppSelector } from "../../../hooks/useRedux";

const MenuBuilderComponent = () => {
  const catalog = useAppSelector(s=>s.ws.catalog!);
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
  const [pifIdToEdit, setPifIdToEdit] = useState<string | null>(null);

  // this assumes a single base product instance per product class.
  // assumption is that this precondition is enforced by the service
  const nameOfBaseProductInstance = useMemo(() => {
    const piid = productToEdit?.baseProductId ?? null;
    return piid !== null ? catalog.productInstances[piid].displayName : "Incomplete Product";
  }, [catalog, productToEdit]);


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
        title={"Edit Category"}
        onClose={() => setIsCategoryEditOpen(false)}
        open={isCategoryEditOpen}
        innerComponent={
          categoryToEdit !== null && 
          <CategoryEditContainer
            onCloseCallback={() => setIsCategoryEditOpen(false)}
            category={categoryToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Category"}
        onClose={() => setIsCategoryDeleteOpen(false)}
        open={isCategoryDeleteOpen}
        innerComponent={
          categoryToEdit !== null && 
          <CategoryDeleteContainer
            onCloseCallback={() => setIsCategoryDeleteOpen(false)}
            category={categoryToEdit}
          />
        }
      />
      <DialogContainer
        title={"Add Modifier Type"}
        onClose={() => setIsModifierTypeAddOpen(false)}
        open={isModifierTypeAddOpen}
        innerComponent={
          <ModifierTypeAddContainer
            onCloseCallback={() => setIsModifierTypeAddOpen(false)}
          />
        }
      />
      <DialogContainer
        title={"Edit Modifier Type"}
        onClose={() => setIsModifierTypeEditOpen(false)}
        open={isModifierTypeEditOpen}
        innerComponent={
          modifierTypeToEdit !== null && 
          <ModifierTypeEditContainer
            onCloseCallback={() => setIsModifierTypeEditOpen(false)}
            modifier_type={modifierTypeToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Modifier Type"}
        onClose={() => setIsModifierTypeDeleteOpen(false)}
        open={isModifierTypeDeleteOpen}
        innerComponent={
          modifierTypeToEdit !== null && 
          <ModifierTypeDeleteContainer
            onCloseCallback={() => setIsModifierTypeDeleteOpen(false)}
            modifier_type={modifierTypeToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={`Add Modifier Option for Type: ${modifierTypeToEdit?.name ?? ""}`}
        onClose={() => setIsModifierOptionAddOpen(false)}
        open={isModifierOptionAddOpen}
        innerComponent={
          modifierTypeToEdit !== null && 
          <ModifierOptionAddContainer
            onCloseCallback={() => setIsModifierOptionAddOpen(false)}
            parent={modifierTypeToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Modifier Option"}
        onClose={() => setIsModifierOptionEditOpen(false)}
        open={isModifierOptionEditOpen}
        innerComponent={
          modifierOptionToEdit !== null && 
          <ModifierOptionEditContainer
            onCloseCallback={() => setIsModifierOptionEditOpen(false)}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        title={"Disable Modifier Option Until End-of-Day"}
        onClose={() => setIsModifierOptionDisableUntilEodOpen(false)}
        open={isModifierOptionDisableUntilEodOpen}
        innerComponent={
          modifierOptionToEdit !== null && 
          <ModifierOptionDisableUntilEodContainer
            onCloseCallback={() => setIsModifierOptionDisableUntilEodOpen(false)}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        title={"Disable Modifier Option"}
        onClose={() => setIsModifierOptionDisableOpen(false)}
        open={isModifierOptionDisableOpen}
        innerComponent={
          modifierOptionToEdit !== null && 
          <ModifierOptionDisableContainer
            onCloseCallback={() => setIsModifierOptionDisableOpen(false)}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        title={"Enable Modifier Option"}
        onClose={() => setIsModifierOptionEnableOpen(false)}
        open={isModifierOptionEnableOpen}
        innerComponent={
          modifierOptionToEdit !== null && 
          <ModifierOptionEnableContainer
            onCloseCallback={() => setIsModifierOptionEnableOpen(false)}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Modifier Option"}
        onClose={() => setIsModifierOptionDeleteOpen(false)}
        open={isModifierOptionDeleteOpen}
        innerComponent={
          modifierOptionToEdit !== null && 
          <ModifierOptionDeleteContainer
            onCloseCallback={() => setIsModifierOptionDeleteOpen(false)}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Product"}
        onClose={() => setIsProductEditOpen(false)}
        open={isProductEditOpen}
        innerComponent={
          productToEdit !== null && 
          <ProductEditContainer
            onCloseCallback={() => setIsProductEditOpen(false)}
            product={productToEdit}
          />
        }
      />
      <DialogContainer
        title={"Disable Product Until End-of-Day"}
        onClose={() => setIsProductDisableUntilEodOpen(false)}
        open={isProductDisableUntilEodOpen}
        innerComponent={
          productToEdit !== null && 
          <ProductDisableUntilEodContainer
            onCloseCallback={() => setIsProductDisableUntilEodOpen(false)}
            product={productToEdit}
            productName={nameOfBaseProductInstance}
          />
        }
      />
      <DialogContainer
        title={"Disable Product"}
        onClose={() => setIsProductDisableOpen(false)}
        open={isProductDisableOpen}
        innerComponent={
          productToEdit !== null &&
          <ProductDisableContainer
            onCloseCallback={() => setIsProductDisableOpen(false)}
            productName={nameOfBaseProductInstance}
            product={productToEdit}
          />
        }
      />
      <DialogContainer
        title={"Enable Product"}
        onClose={() => setIsProductEnableOpen(false)}
        open={isProductEnableOpen}
        innerComponent={
          productToEdit !== null && 
          <ProductEnableContainer
            onCloseCallback={() => setIsProductEnableOpen(false)}
            product={productToEdit}
            productName={nameOfBaseProductInstance}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Copy Product"}
        onClose={() => setIsProductCopyOpen(false)}
        open={isProductCopyOpen}
        innerComponent={
          productToEdit !== null && 
          <ProductCopyContainer
            onCloseCallback={() => setIsProductCopyOpen(false)}
            product={productToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Product"}
        onClose={() => setIsProductDeleteOpen(false)}
        open={isProductDeleteOpen}
        innerComponent={
          productToEdit !== null &&
          <ProductDeleteContainer
            onCloseCallback={() => setIsProductDeleteOpen(false)}
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
        innerComponent={
          productToEdit !== null &&
          <ProductInstanceAddContainer
            onCloseCallback={() => setIsProductInstanceAddOpen(false)}
            parent_product={productToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Product Instance"}
        onClose={() => setIsProductInstanceEditOpen(false)}
        open={isProductInstanceEditOpen}
        innerComponent={
          productToEdit !== null && productInstanceToEdit !== null &&
          <ProductInstanceEditContainer
            onCloseCallback={() => setIsProductInstanceEditOpen(false)}
            parent_product={productToEdit}
            product_instance={productInstanceToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Product Instance"}
        onClose={() => setIsProductInstanceDeleteOpen(false)}
        open={isProductInstanceDeleteOpen}
        innerComponent={
          productInstanceToEdit !== null &&
          <ProductInstanceDeleteContainer
            onCloseCallback={() => setIsProductInstanceDeleteOpen(false)}
            product_instance={productInstanceToEdit}
          />
        }
      />
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
                    onCloseCallback={() => {
                      setIsProductAddOpen(false);
                    }}
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
                    onCloseCallback={() => {
                      setIsProductImportOpen(false);
                    }}
                  />
                ),
              },
            ]}
            onClose={() => setIsCategoryInterstitialOpen(false)}
            open={isCategoryInterstitialOpen}
          />
          <CategoryTableContainer
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
