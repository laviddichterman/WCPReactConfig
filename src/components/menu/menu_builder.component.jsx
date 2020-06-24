import React, { useState, forwardRef } from "react";

import InterstitialDialog from '../interstitial.dialog.component'
import DialogContainer from '../dialog.container';
import CategoryAddContainer from "./category.add.container";
import CategoryEditContainer from "./category.edit.container";
import ModifierTypeAddContainer from "./modifier_type.add.container";
import ModifierOptionEditContainer from "./modifier_option.edit.container";
import ModifierTypeEditContainer from "./modifier_type.edit.container";
import ModifierOptionAddContainer from "./modifier_option.add.container";
import ProductAddContainer from "./product.add.container";
import ProductEditContainer from "./product.edit.container";
import ProductInstanceAddContainer from "./product_instance.add.container";
import ProductInstanceEditContainer from "./product_instance.edit.container";
import CategoryTableContainer from "./category_table.container";
import ModifierTypeTableContainer from "./modifier_type_table.container";


import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  ExpandLess,
  ExpandMore,
} from "@material-ui/icons";
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  ExpandLess: forwardRef((props, ref) => <ExpandLess {...props} ref={ref} />),
  ExpandMore: forwardRef((props, ref) => <ExpandMore {...props} ref={ref} />),
};

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

// Returns [ category_map, product_map, orphan_products ] array;
// category_map entries are mapping of catagory_id to { category, children (id list), product (id list) }
// product_map is mapping from product_id to { product, instances (list of instance objects)}
// orphan_products is list of orphan product ids
// TODO: memoize this
const catalog_map_generator = (categories, products, product_instances) => {
  const category_map = {};
  categories.forEach((curr) => {
    category_map[curr._id] = { category: curr, children: [], products: [] };
  });
  for (var i = 0; i < categories.length; ++i) {
    if (categories[i].parent_id.length > 0) {
      category_map[categories[i].parent_id].children.push(categories[i]._id);
    }
  }
  const product_map = {};
  const orphan_products = [];
  products.forEach((curr) => {
    product_map[curr._id] = { product: curr, instances: [] };
    if (curr.category_ids.length === 0) {
      orphan_products.push(curr._id);
    }
    else {
      curr.category_ids.forEach((cid) => {
        category_map[cid].products.push(curr._id);
      });
    }
  });
  product_instances.forEach((curr) => {
    product_map[curr.product_id].instances.push(curr);
  })
  return [ category_map, product_map, orphan_products ];
};

const modifier_types_map_generator = (modifier_types, options) => {
  var modifier_types_map = {};
  modifier_types.forEach(mt => {
    modifier_types_map[mt._id] = { options: [], modifier_type: mt } ;
  });
  options.forEach(o => {
    modifier_types_map[o.option_type_id].options.push(o);
  })
  return modifier_types_map;
};


const MenuBuilderComponent = ({
  ENDPOINT,
  categories,
  options,
  option_types,
  products,
  product_instances,
}) => {
  const classes = useStyles();
  const [isModifierInterstitialOpen, setIsModifierInterstitialOpen] = useState(false);
  const [isModifierTypeAddOpen, setIsModifierTypeAddOpen] = useState(false);
  const [isModifierOptionAddOpen, setIsModifierOptionAddOpen] = useState(false);

  const [isModifierTypeEditOpen, setIsModifierTypeEditOpen] = useState(false);
  const [modifierTypeToEdit, setModifierTypeToEdit] = useState(null);

  const [isModifierOptionEditOpen, setIsModifierOptionEditOpen] = useState(false);
  const [modifierOptionToEdit, setModifierOptionToEdit] = useState(null);
  
  const [isCategoryInterstitialOpen, setIsCategoryInterstitialOpen] = useState(false);
  const [isCategoryAddOpen, setIsCategoryAddOpen] = useState(false);
  const [isProductAddOpen, setIsProductAddOpen] = useState(false);

  const [isProductInstanceAddOpen, setIsProductInstanceAddOpen] = useState(false);

  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const [isProductEditOpen, setIsProductEditOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [isProductInstanceEditOpen, setIsProductInstanceEditOpen] = useState(false);
  const [productInstanceToEdit, setProductInstanceToEdit] = useState(null);
  
  // create maps from catalog data
  const modifier_types_map = modifier_types_map_generator(option_types, options);
  const [ category_map, product_map, orphan_products ] = catalog_map_generator(categories, products, product_instances);

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
            categories={categories}
            ENDPOINT={ENDPOINT}
            category={categoryToEdit}
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
            modifier_type={modifierTypeToEdit}
            ENDPOINT={ENDPOINT}
          />
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
            modifier_option={modifierOptionToEdit}
            modifier_types={option_types}
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
            categories={categories} 
            modifier_types={option_types}
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
            modifier_types_map={modifier_types_map}
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
            modifier_types_map={modifier_types_map}
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
                component: (<CategoryAddContainer ENDPOINT={ENDPOINT} categories={categories} />)
              },
              {
                title: "Add Product", 
                cb: () => setIsProductAddOpen(true), 
                open: isProductAddOpen,
                onClose: () => setIsProductAddOpen(false),
                component: (<ProductAddContainer ENDPOINT={ENDPOINT} categories={categories} modifier_types={option_types} />)
              }
            ]}
            onClose={() => setIsCategoryInterstitialOpen(false)}
            open={isCategoryInterstitialOpen}
          />
          <CategoryTableContainer
            categories={categories}
            category_map={category_map}
            product_map={product_map}
            setIsCategoryInterstitialOpen={setIsCategoryInterstitialOpen}
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
          <InterstitialDialog 
            dialogTitle={"Add new..."}
            options={[
              {
                title: "Add Modifier Type", 
                cb: () => {setIsModifierTypeAddOpen(true)}, 
                open: isModifierTypeAddOpen,
                onClose: () => setIsModifierTypeAddOpen(false),
                component: (<ModifierTypeAddContainer ENDPOINT={ENDPOINT} />)
              },
              {
                title: "Add Modifier Option", 
                cb: () => setIsModifierOptionAddOpen(true), 
                open: isModifierOptionAddOpen,
                onClose: () => setIsModifierOptionAddOpen(false),
                component: (<ModifierOptionAddContainer ENDPOINT={ENDPOINT} modifier_types={option_types} />)
              }
            ]}
            onClose={() => setIsModifierInterstitialOpen(false)}
            open={isModifierInterstitialOpen}
          />
          <ModifierTypeTableContainer
            option_types={option_types}
            modifier_types_map={modifier_types_map}
            setIsModifierTypeEditOpen={setIsModifierTypeEditOpen}
            setModifierTypeToEdit={setModifierTypeToEdit}
            setIsModifierInterstitialOpen={setIsModifierInterstitialOpen}
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
