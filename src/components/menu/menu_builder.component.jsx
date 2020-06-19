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

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Hidden from '@material-ui/core/Hidden';

import TreeItem from "@material-ui/lab/TreeItem";
import MaterialTable from "material-table";

import { useAuth0 } from "../../react-auth0-spa";


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
        title={`Add Product Instance for: ${productToEdit ? productToEdit.item.display_name : ""}`}
        onClose={() => {
          setIsProductInstanceAddOpen(false);
        }} 
        isOpen={isProductInstanceAddOpen} 
        inner_component={
          <ProductAddContainer 
            categories={categories} 
            modifier_types={option_types}
            product={productToEdit}
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
          <MaterialTable
            title="Catalog Tree View"
            parentChildData={(row, rows) =>
              rows.find((a) => a._id === row.parent_id)
            }
            columns={[
              { title: "Name", field: "name" },
              { title: "Description", field: "description" },
            ]}
            options={{
              detailPanelType: "single",
              draggable: false,
              paging: false
            }}
            actions={[
              {
                icon: AddBox,
                tooltip: 'Add new...',
                onClick: (event, rowData) => {
                  setIsCategoryInterstitialOpen(true);
                },
                isFreeAction: true
              },
              {
                icon: Edit,
                tooltip: 'Edit Category',
                onClick: (event, rowData) => {
                  setIsCategoryEditOpen(true);
                  setCategoryToEdit(rowData);
                },
              }
            ]}
            data={categories}
            icons={tableIcons}
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
            detailPanel={[
              {
                render: (rowData) => {
                  return category_map[rowData._id].products.length ? (
                  <MaterialTable
                    
                    options={{
                      showTitle: false,
                      showEmptyDataSourceMessage: false,
                      sorting: false,
                      draggable: false,
                      search: false,
                      rowStyle: {
                        padding: 0,
                      },
                      toolbar: false,
                      paging: category_map[rowData._id].products.length > 5
                    }}
                    actions={[
                      {
                        icon: Edit,
                        tooltip: 'Edit Product',
                        onClick: (event, rowData) => {
                          setIsProductEditOpen(true);
                          setProductToEdit(rowData.product);
                        },
                      },
                      {
                        icon: AddBox,
                        tooltip: 'Add Product Instance',
                        onClick: (event, rowData) => {
                          setIsProductInstanceAddOpen(true);
                          setProductToEdit(rowData.product);
                        },
                      },
                    ]}
                    icons={tableIcons}
                    columns={[
                      { title: "Name", field: "product.item.display_name" },
                      { title: "Price", field: "product.item.price.amount" },
                      { title: "Shortcode", field: "product.item.shortcode" },
                      { title: "Description", field: "product.item.description" },
                      { title: "EXID: Revel", field: "product.item.externalIDs.revelID" },
                      { title: "EXID: Square", field: "product.item.externalIDs.squareID" },
                      { title: "Disabled", field: "product.item.disabled" },
                    ]}
                    data={Object.values(product_map).filter(x => x.product.category_ids.includes(rowData._id))}
                     />) : ""
                },
                icon: ()=> { return null }
              }
            ]}
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
          <MaterialTable
            title="Modifier Types / Modifier Type Option"
            columns={[
              { title: "Name", field: "name" },
              { title: "Selection Type", field: "selection_type" },
              { title: "Ordinal", field: "ordinal" },
              { title: "EXID: Revel", field: "externalIDs.revelID" },
              { title: "EXID: Square", field: "externalIDs.squareID" },
            ]}
            options={{
              detailPanelType: "single",
              draggable: false,
              paging: false
            }}
            actions={[
              {
                icon: AddBox,
                tooltip: 'Add new...',
                onClick: (event, rowData) => {
                  setIsModifierInterstitialOpen(true);
                },
                isFreeAction: true
              },
              {
                icon: Edit,
                tooltip: 'Edit Modifier Type',
                onClick: (event, rowData) => {
                  setIsModifierTypeEditOpen(true);
                  setModifierTypeToEdit(rowData);
                },
              }
            ]}
            data={option_types}
            icons={tableIcons}
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
            detailPanel={[
              {
                render: (rowData) => {
                  return modifier_types_map[rowData._id].options.length ? (
                  <MaterialTable
                    
                    options={{
                      showTitle: false,
                      showEmptyDataSourceMessage: false,
                      sorting: false,
                      draggable: false,
                      search: false,
                      rowStyle: {
                        padding: 0,
                      },
                      toolbar: false,
                      paging: modifier_types_map[rowData._id].options.length > 5
                    }}
                    actions={[
                      {
                        icon: Edit,
                        tooltip: 'Edit Modifier Option',
                        onClick: (event, rowData) => {
                          setIsModifierOptionEditOpen(true);
                          setModifierOptionToEdit(rowData);
                        },
                      }
                    ]}
                    icons={tableIcons}
                    columns={[
                      { title: "Name", field: "catalog_item.display_name" },
                      { title: "Price", field: "catalog_item.price.amount" },
                      { title: "Shortcode", field: "catalog_item.shortcode" },
                      { title: "Description", field: "catalog_item.description" },
                      { title: "Ordinal", field: "ordinal" },
                      { title: "FFactor", field: "metadata.flavor_factor" },
                      { title: "BFactor", field: "metadata.bake_factor" },
                      { title: "Can Split?", field: "metadata.can_split" },
                      { title: "EnableFxn", field: "enable_function_name" },
                      { title: "EXID: Revel", field: "catalog_item.externalIDs.revelID" },
                      { title: "EXID: Square", field: "catalog_item.externalIDs.squareID" },
                      { title: "Disabled", field: "catalog_item.disabled" },
                    ]}
                    data={modifier_types_map[rowData._id].options}
                     />) : ""
                },
                icon: ()=> { return null }
              }
            ]}
          />
        </Grid>
      </Grid>
      <br />
    </div>
  );
};

export default MenuBuilderComponent;
