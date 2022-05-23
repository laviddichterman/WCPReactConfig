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


const MenuBuilderComponent = ({ ENDPOINT, catalog }) => {
  const [isModifierTypeAddOpen, setIsModifierTypeAddOpen] = useState(false);
  const [isModifierTypeEditOpen, setIsModifierTypeEditOpen] = useState(false);
  const [isModifierTypeDeleteOpen, setIsModifierTypeDeleteOpen] = useState(false);

  const [isModifierOptionAddOpen, setIsModifierOptionAddOpen] = useState(false);
  const [isModifierOptionEditOpen, setIsModifierOptionEditOpen] = useState(false);
  const [isModifierOptionDeleteOpen, setIsModifierOptionDeleteOpen] = useState(false);
  const [isModifierOptionEnableOpen, setIsModifierOptionEnableOpen] = useState(false);
  const [isModifierOptionDisableOpen, setIsModifierOptionDisableOpen] = useState(false);
  const [isModifierOptionDisableUntilEodOpen, setIsModifierOptionDisableUntilEodOpen] = useState(false);
  
  const [modifierTypeToEdit, setModifierTypeToEdit] = useState(null);
  const [modifierOptionToEdit, setModifierOptionToEdit] = useState(null);

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
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const [isProductEditOpen, setIsProductEditOpen] = useState(false);
  const [isProductDisableUntilEodOpen, setIsProductDisableUntilEodOpen] = useState(false);
  const [isProductDisableOpen, setIsProductDisableOpen] = useState(false);
  const [isProductEnableOpen, setIsProductEnableOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [isProductInstanceEditOpen, setIsProductInstanceEditOpen] = useState(false);
  const [productInstanceToEdit, setProductInstanceToEdit] = useState(null);

  const [isProductInstanceFunctionAddOpen, setIsProductInstanceFunctionAddOpen] = useState(false);
  const [isProductInstanceFunctionDeleteOpen, setIsProductInstanceFunctionDeleteOpen] = useState(false);
  const [isProductInstanceFunctionEditOpen, setIsProductInstanceFunctionEditOpen] = useState(false);
  const [productInstanceFunctionToEdit, setProductInstanceFunctionToEdit] = useState(null);

  const orphanedProducts = useMemo(
    () =>
      Object.values(catalog.products).filter(
        (x) =>
          x.product.category_ids.filter((x) => x && x.length > 0).length === 0
      ),
    [catalog.products]
  );

  console.log(catalog);
  return (
    <div>
      <DialogContainer
        title={"Edit Category"}
        onClose={() => {
          setIsCategoryEditOpen(false);
        }}
        isOpen={isCategoryEditOpen}
        inner_component={
          <CategoryEditContainer
            onCloseCallback={() => {
              setIsCategoryEditOpen(false);
            }}
            categories={catalog.categories}
            ENDPOINT={ENDPOINT}
            category={categoryToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Category"}
        onClose={() => {
          setIsCategoryDeleteOpen(false);
        }}
        isOpen={isCategoryDeleteOpen}
        inner_component={
          <CategoryDeleteContainer
            onCloseCallback={() => {
              setIsCategoryDeleteOpen(false);
            }}
            ENDPOINT={ENDPOINT}
            category={categoryToEdit}
          />
        }
      />
      <DialogContainer
        title={"Add Modifier Type"}
        onClose={() => {
          setIsModifierTypeAddOpen(false);
        }}
        isOpen={isModifierTypeAddOpen}
        inner_component={
          <ModifierTypeAddContainer
            onCloseCallback={() => {
              setIsModifierTypeAddOpen(false);
            }}
            ENDPOINT={ENDPOINT}
          />
        }
      />
      <DialogContainer
        title={"Edit Modifier Type"}
        onClose={() => {
          setIsModifierTypeEditOpen(false);
        }}
        isOpen={isModifierTypeEditOpen}
        inner_component={
          <ModifierTypeEditContainer
            onCloseCallback={() => {
              setIsModifierTypeEditOpen(false);
            }}
            modifier_type={modifierTypeToEdit}
            ENDPOINT={ENDPOINT}
          />
        }
      />
      <DialogContainer
        title={"Delete Modifier Type"}
        onClose={() => {
          setIsModifierTypeDeleteOpen(false);
        }}
        isOpen={isModifierTypeDeleteOpen}
        inner_component={
          <ModifierTypeDeleteContainer
            onCloseCallback={() => {
              setIsModifierTypeDeleteOpen(false);
            }}
            ENDPOINT={ENDPOINT}
            modifier_type={modifierTypeToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={`Add Modifier Option for Type: ${
          modifierTypeToEdit ? modifierTypeToEdit.name : ""
        }`}
        onClose={() => {
          setIsModifierOptionAddOpen(false);
        }}
        isOpen={isModifierOptionAddOpen}
        inner_component={
          <ModifierOptionAddContainer
            onCloseCallback={() => {
              setIsModifierOptionAddOpen(false);
            }}
            product_instance_functions={catalog.product_instance_functions}
            ENDPOINT={ENDPOINT}
            parent={modifierTypeToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Modifier Option"}
        onClose={() => {
          setIsModifierOptionEditOpen(false);
        }}
        isOpen={isModifierOptionEditOpen}
        inner_component={
          <ModifierOptionEditContainer
            onCloseCallback={() => {
              setIsModifierOptionEditOpen(false);
            }}
            product_instance_functions={catalog.product_instance_functions}
            modifier_option={modifierOptionToEdit}
            modifier_types={catalog.modifiers}
            ENDPOINT={ENDPOINT}
          />
        }
      />
      <DialogContainer
        title={"Disable Modifier Option Until End-of-Day"}
        onClose={() => {
          setIsModifierOptionDisableUntilEodOpen(false);
        }}
        isOpen={isModifierOptionDisableUntilEodOpen}
        inner_component={
          <ModifierOptionDisableUntilEodContainer
            onCloseCallback={() => {
              setIsModifierOptionDisableUntilEodOpen(false);
            }}
            ENDPOINT={ENDPOINT}
            modifier_option={modifierOptionToEdit}
          />
        }
      />  
      <DialogContainer
        title={"Disable Modifier Option"}
        onClose={() => {
          setIsModifierOptionDisableOpen(false);
        }}
        isOpen={isModifierOptionDisableOpen}
        inner_component={
          <ModifierOptionDisableContainer
            onCloseCallback={() => {
              setIsModifierOptionDisableOpen(false);
            }}
            ENDPOINT={ENDPOINT}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        title={"Enable Modifier Option"}
        onClose={() => {
          setIsModifierOptionEnableOpen(false);
        }}
        isOpen={isModifierOptionEnableOpen}
        inner_component={
          <ModifierOptionEnableContainer
            onCloseCallback={() => {
              setIsModifierOptionEnableOpen(false);
            }}
            ENDPOINT={ENDPOINT}
            modifier_option={modifierOptionToEdit}
          />
        }
      />        
      <DialogContainer
        title={"Delete Modifier Option"}
        onClose={() => {
          setIsModifierOptionDeleteOpen(false);
        }}
        isOpen={isModifierOptionDeleteOpen}
        inner_component={
          <ModifierOptionDeleteContainer
            onCloseCallback={() => {
              setIsModifierOptionDeleteOpen(false);
            }}
            ENDPOINT={ENDPOINT}
            modifier_option={modifierOptionToEdit}
          />
        }
      />
      <DialogContainer
        title={"Edit Product"}
        onClose={() => {
          setIsProductEditOpen(false);
        }}
        isOpen={isProductEditOpen}
        inner_component={
          <ProductEditContainer
            onCloseCallback={() => {
              setIsProductEditOpen(false);
            }}
            categories={catalog.categories}
            modifier_types={catalog.modifiers}
            product_instance_functions={catalog.product_instance_functions}
            product={productToEdit}
            ENDPOINT={ENDPOINT}
          />
        }
      />
      <DialogContainer
        title={"Disable Product Until End-of-Day"}
        onClose={() => {
          setIsProductDisableUntilEodOpen(false);
        }}
        isOpen={isProductDisableUntilEodOpen}
        inner_component={
          <ProductDisableUntilEodContainer
            onCloseCallback={() => {
              setIsProductDisableUntilEodOpen(false);
            }}
            product={productToEdit}
            ENDPOINT={ENDPOINT}
          />
        }
      />
      <DialogContainer
        title={"Disable Product"}
        onClose={() => {
          setIsProductDisableOpen(false);
        }}
        isOpen={isProductDisableOpen}
        inner_component={
          <ProductDisableContainer
            onCloseCallback={() => {
              setIsProductDisableOpen(false);
            }}
            product={productToEdit}
            ENDPOINT={ENDPOINT}
          />
        }
      />
      <DialogContainer
        title={"Enable Product"}
        onClose={() => {
          setIsProductEnableOpen(false);
        }}
        isOpen={isProductEnableOpen}
        inner_component={
          <ProductEnableContainer
            onCloseCallback={() => {
              setIsProductEnableOpen(false);
            }}
            product={productToEdit}
            ENDPOINT={ENDPOINT}
          />
        }
      />                      
      <DialogContainer
        title={`Make copy of: ${
          productToEdit ? productToEdit.item.display_name : ""
        }`}
        onClose={() => {
          setIsProductCopyOpen(false);
        }}
        isOpen={isProductCopyOpen}
        inner_component={
          <ProductCopyContainer
            onCloseCallback={() => {
              setIsProductCopyOpen(false);
            }}
            categories={catalog.categories}
            modifier_types={catalog.modifiers}
            product_instance_functions={catalog.product_instance_functions}
            products={catalog.products}
            product={productToEdit}
            ENDPOINT={ENDPOINT}
          />
        }
      />      
      <DialogContainer
        title={"Delete Product"}
        onClose={() => {
          setIsProductDeleteOpen(false);
        }}
        isOpen={isProductDeleteOpen}
        inner_component={
          <ProductDeleteContainer
            onCloseCallback={() => {
              setIsProductDeleteOpen(false);
            }}
            ENDPOINT={ENDPOINT}
            product={productToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={`Add Product Instance for: ${
          productToEdit ? productToEdit.item?.display_name : ""
        }`}
        onClose={() => {
          setIsProductInstanceAddOpen(false);
        }}
        isOpen={isProductInstanceAddOpen}
        inner_component={
          <ProductInstanceAddContainer
            onCloseCallback={() => {
              setIsProductInstanceAddOpen(false);
            }}
            modifier_types_map={catalog.modifiers}
            parent_product={productToEdit}
            ENDPOINT={ENDPOINT}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Product Instance"}
        onClose={() => {
          setIsProductInstanceEditOpen(false);
        }}
        isOpen={isProductInstanceEditOpen}
        inner_component={
          <ProductInstanceEditContainer
            onCloseCallback={() => {
              setIsProductInstanceEditOpen(false);
            }}
            modifier_types_map={catalog.modifiers}
            parent_product={productToEdit}
            product_instance={productInstanceToEdit}
            ENDPOINT={ENDPOINT}
          />
        }
      />
      <DialogContainer
        title={"Delete Product Instance"}
        onClose={() => {
          setIsProductInstanceDeleteOpen(false);
        }}
        isOpen={isProductInstanceDeleteOpen}
        inner_component={
          <ProductInstanceDeleteContainer
            onCloseCallback={() => {
              setIsProductInstanceDeleteOpen(false);
            }}
            ENDPOINT={ENDPOINT}
            product_instance={productInstanceToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Add Product Instance Function"}
        onClose={() => {
          setIsProductInstanceFunctionAddOpen(false);
        }}
        isOpen={isProductInstanceFunctionAddOpen}
        inner_component={
          <ProductInstanceFunctionAddContainer
            onCloseCallback={() => {
              setIsProductInstanceFunctionAddOpen(false);
            }}
            modifier_types={catalog.modifiers}
            ENDPOINT={ENDPOINT}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Product Instance Function"}
        onClose={() => {
          setIsProductInstanceFunctionEditOpen(false);
        }}
        isOpen={isProductInstanceFunctionEditOpen}
        inner_component={
          <ProductInstanceFunctionEditContainer
            onCloseCallback={() => {
              setIsProductInstanceFunctionEditOpen(false);
            }}
            modifier_types={catalog.modifiers}
            product_instance_function={productInstanceFunctionToEdit}
            ENDPOINT={ENDPOINT}
          />
        }
      />
      <DialogContainer
        title={"Delete Product Instance Function"}
        onClose={() => {
          setIsProductInstanceFunctionDeleteOpen(false);
        }}
        isOpen={isProductInstanceFunctionDeleteOpen}
        inner_component={
          <ProductInstanceFunctionDeleteContainer
            onCloseCallback={() => {
              setIsProductInstanceFunctionDeleteOpen(false);
            }}
            ENDPOINT={ENDPOINT}
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
                    ENDPOINT={ENDPOINT}
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
                    ENDPOINT={ENDPOINT}
                    onCloseCallback={() => {
                      setIsProductAddOpen(false);
                    }}
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
                    ENDPOINT={ENDPOINT}
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
            setIsProductImportOpen={setIsProductImportOpen}
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
              title="Orphan Products"
              products={orphanedProducts}
              catalog={catalog}
              setProductToEdit={setProductToEdit}
              setIsProductEditOpen={setIsProductEditOpen}
              setIsProductCopyOpen={setIsProductCopyOpen}
              setIsProductDeleteOpen={setIsProductDeleteOpen}
              setIsProductDisableOpen={setIsProductDisableOpen}
              setIsProductDisableUntilEodOpen={setIsProductDisableUntilEodOpen}
              setIsProductEnableOpen={setIsProductEnableOpen}
              setIsProductImportOpen={setIsProductImportOpen}              
              setIsProductInstanceAddOpen={setIsProductInstanceAddOpen}
              setIsProductInstanceEditOpen={setIsProductInstanceEditOpen}
              setIsProductInstanceDeleteOpen={setIsProductInstanceDeleteOpen}
              setProductInstanceToEdit={setProductInstanceToEdit}
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
