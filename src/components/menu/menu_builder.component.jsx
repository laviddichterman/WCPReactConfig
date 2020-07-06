import React, { useState } from "react";

import InterstitialDialog from '../interstitial.dialog.component'
import DialogContainer from '../dialog.container';
import CategoryAddContainer from "./category.add.container";
import CategoryEditContainer from "./category.edit.container";
import CategoryDeleteContainer from "./category.delete.container";
import ModifierTypeAddContainer from "./modifier_type.add.container";
import ModifierTypeEditContainer from "./modifier_type.edit.container";
import ModifierTypeDeleteContainer from "./modifier_type.delete.container";
import ModifierOptionAddContainer from "./modifier_option.add.container";
import ModifierOptionEditContainer from "./modifier_option.edit.container";
import ProductAddContainer from "./product.add.container";
import ProductEditContainer from "./product.edit.container";
import ProductInstanceAddContainer from "./product_instance.add.container";
import ProductInstanceEditContainer from "./product_instance.edit.container";
import CategoryTableContainer from "./category_table.container";
import ModifierTypeTableContainer from "./modifier_type_table.container";
import ProductTableContainer from "./product_table.container";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  category_tree: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  title: {
    flexGrow: 1,
  },
  listLevel0: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  listLevel1: {
    paddingLeft: theme.spacing(4),
  },
}));

const MenuBuilderComponent = ({
  ENDPOINT,
  catalog
}) => {
  const classes = useStyles();
  const [isModifierTypeAddOpen, setIsModifierTypeAddOpen] = useState(false);
  const [isModifierOptionAddOpen, setIsModifierOptionAddOpen] = useState(false);

  const [isModifierTypeEditOpen, setIsModifierTypeEditOpen] = useState(false);
  const [modifierTypeToEdit, setModifierTypeToEdit] = useState(null);
  const [isModifierTypeDeleteOpen, setIsModifierTypeDeleteOpen] = useState(false);

  const [isModifierOptionEditOpen, setIsModifierOptionEditOpen] = useState(false);
  const [modifierOptionToEdit, setModifierOptionToEdit] = useState(null);
  
  const [isCategoryInterstitialOpen, setIsCategoryInterstitialOpen] = useState(false);
  const [isCategoryAddOpen, setIsCategoryAddOpen] = useState(false);
  const [isProductAddOpen, setIsProductAddOpen] = useState(false);

  const [isProductInstanceAddOpen, setIsProductInstanceAddOpen] = useState(false);

  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false);
  const [isCategoryDeleteOpen, setIsCategoryDeleteOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const [isProductEditOpen, setIsProductEditOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [isProductInstanceEditOpen, setIsProductInstanceEditOpen] = useState(false);
  const [productInstanceToEdit, setProductInstanceToEdit] = useState(null);
  console.log(catalog);
  return (
    <div className={classes.root}>
      <DialogContainer 
        title={"Edit Category"}
        onClose={() => {
          setIsCategoryEditOpen(false);
        }} 
        isOpen={isCategoryEditOpen} 
        inner_component={
          <CategoryEditContainer 
            onCloseCallback={() => {setIsCategoryEditOpen(false);}}
            categories={catalog.categories}
            ENDPOINT={ENDPOINT}
            category={categoryToEdit}
          />
        } 
      />
      <DialogContainer 
        title={"Delete Category"}
        onClose={() => {setIsCategoryDeleteOpen(false);}} 
        isOpen={isCategoryDeleteOpen} 
        inner_component={
          <CategoryDeleteContainer 
            onCloseCallback={() => {setIsCategoryDeleteOpen(false);}}   
            ENDPOINT={ENDPOINT}
            category={categoryToEdit}
          />
        } 
      />
      <DialogContainer 
        title={"Add Modifier Type"}
        onClose={() => {setIsModifierTypeAddOpen(false);}} 
        isOpen={isModifierTypeAddOpen} 
        inner_component={
          <ModifierTypeAddContainer 
            onCloseCallback={() => {setIsModifierTypeAddOpen(false);}} 
            ENDPOINT={ENDPOINT} />
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
            onCloseCallback={() => {setIsModifierTypeEditOpen(false);}}
            modifier_type={modifierTypeToEdit}
            ENDPOINT={ENDPOINT}
          />
        } 
      />   
      <DialogContainer 
        title={"Delete Modifier Type"}
        onClose={() => {setIsModifierTypeDeleteOpen(false);}} 
        isOpen={isModifierTypeDeleteOpen} 
        inner_component={
          <ModifierTypeDeleteContainer 
            onCloseCallback={() => {setIsModifierTypeDeleteOpen(false);}}   
            ENDPOINT={ENDPOINT}
            modifier_type={modifierTypeToEdit}
          />
        } 
      />      
      <DialogContainer 
        maxWidth={"xl"}
        title={`Add Modifier Option for Type: ${modifierTypeToEdit ? modifierTypeToEdit.name : ""}`}
        onClose={() => {
          setIsModifierOptionAddOpen(false);
        }} 
        isOpen={isModifierOptionAddOpen} 
        inner_component={
          <ModifierOptionAddContainer 
                  onCloseCallback={() => {setIsModifierOptionAddOpen(false);}} 
                  ENDPOINT={ENDPOINT} 
                  parent={modifierTypeToEdit} />
        } 
      />           
      <DialogContainer 
        title={"Edit Modifier Option"}
        onClose={() => {
          setIsModifierOptionEditOpen(false);
        }} 
        isOpen={isModifierOptionEditOpen} 
        inner_component={
          <ModifierOptionEditContainer 
            onCloseCallback={() => {setIsModifierOptionEditOpen(false);}}
            modifier_option={modifierOptionToEdit}
            modifier_types={catalog.modifiers}
            ENDPOINT={ENDPOINT}
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
            onCloseCallback={() => {setIsProductEditOpen(false);}}
            categories={catalog.categories} 
            modifier_types={catalog.modifiers}
            product={productToEdit}
            ENDPOINT={ENDPOINT}
          />
        } 
      />   
      <DialogContainer 
        maxWidth={"xl"}
        title={`Add Product Instance for: ${productToEdit ? productToEdit.item.display_name : ""}`}
        onClose={() => {
          setIsProductInstanceAddOpen(false);
        }} 
        isOpen={isProductInstanceAddOpen} 
        inner_component={
          <ProductInstanceAddContainer 
            onCloseCallback={() => {setIsProductInstanceAddOpen(false);}}
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
            onCloseCallback={() => {setIsProductInstanceEditOpen(false);}} 
            modifier_types_map={catalog.modifiers}
            parent_product={productToEdit}
            product_instance={productInstanceToEdit}
            ENDPOINT={ENDPOINT}
          />
        } 
      />                          
      <Grid container justify="center" spacing={3}>
        <Grid item xs={12}>
          <InterstitialDialog 
            dialogTitle={"Add new..."}
            options={[
              {
                title: "Add Category", 
                cb: () => {setIsCategoryAddOpen(true)}, 
                open: isCategoryAddOpen,
                onClose: () => setIsCategoryAddOpen(false),
                component: (<CategoryAddContainer 
                  onCloseCallback={() => {setIsCategoryAddOpen(false);}} 
                  ENDPOINT={ENDPOINT} 
                  categories={catalog.categories} 
                  />)
              },
              {
                title: "Add Product", 
                cb: () => setIsProductAddOpen(true), 
                open: isProductAddOpen,
                onClose: () => setIsProductAddOpen(false),
                component: (<ProductAddContainer 
                  ENDPOINT={ENDPOINT} 
                  onCloseCallback={() => {setIsProductAddOpen(false);}} 
                  categories={catalog.categories} 
                  modifier_types={catalog.modifiers} />)
              }
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
            setIsProductInstanceAddOpen={setIsProductInstanceAddOpen}
            setIsProductInstanceEditOpen={setIsProductInstanceEditOpen}
            productInstanceToEdit={productInstanceToEdit}  
            setProductInstanceToEdit={setProductInstanceToEdit}
          />
        </Grid>
        <Grid item xs={12}>
          <ProductTableContainer
            title="Orphan Products"
            products={Object.values(catalog.products).filter((x) =>
              x.product.category_ids.filter(x => x && x.length > 0).length === 0)}
            catalog={catalog}
            setProductToEdit={setProductToEdit}            
            setIsProductEditOpen={setIsProductEditOpen}            
            setIsProductInstanceAddOpen={setIsProductInstanceAddOpen}   
            setIsProductInstanceEditOpen={setIsProductInstanceEditOpen}   
            setProductInstanceToEdit={setProductInstanceToEdit}
          />
        </Grid>
        <Grid item xs={12}>
          <ModifierTypeTableContainer
            modifier_types_map={catalog.modifiers}
            setIsModifierTypeEditOpen={setIsModifierTypeEditOpen}
            setIsModifierTypeDeleteOpen={setIsModifierTypeDeleteOpen}
            setModifierTypeToEdit={setModifierTypeToEdit}
            setIsModifierTypeAddOpen={setIsModifierTypeAddOpen}
            setIsModifierOptionAddOpen={setIsModifierOptionAddOpen}
            setModifierOptionToEdit={setModifierOptionToEdit}
            setIsModifierOptionEditOpen={setIsModifierOptionEditOpen}
          />
        </Grid>
      </Grid>
      <br />
    </div>
  );
};

export default MenuBuilderComponent;
