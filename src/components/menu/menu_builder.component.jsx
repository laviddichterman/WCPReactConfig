import React, { useState, forwardRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
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
import CategoryComponent from "./category.component";
import OptionTypeAdderComponent from "./option_type_adder.component";

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

// each node is { category, children }
// TODO: memoize this
const categories_list_to_dict = (categories) => {
  const category_dict = {};
  categories.map((curr, i) => {
    category_dict[curr._id] = { category: curr, children: [] };
  });
  for (var i = 0; i < categories.length; ++i) {
    if (categories[i].parent_id.length > 0) {
      category_dict[categories[i].parent_id].children.push(categories[i]._id);
    }
  }
  return category_dict;
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
  //const { getTokenSilently } = useAuth0();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="subtitle1" className={classes.title}>
                  Menu builder:
                </Typography>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={6}>
            <CategoryComponent ENDPOINT={ENDPOINT} categories={categories} />
          </Grid>
          <Grid item xs={6}>
            <OptionTypeAdderComponent
              ENDPOINT={ENDPOINT}
              options={options}
              option_types={option_types}
            />
          </Grid>
        </Grid>
      </Paper>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={6}>
          <MaterialTable
            title="Catalog Tree View"
            parentChildData={(row, rows) =>
              rows.find((a) => a._id === row.parent_id)
            }
            columns={[
              { title: "Name", field: "name" },
              { title: "Description", field: "description" },
            ]}
            options={{detailPanelType: "single"}}
            data={categories}
            icons={tableIcons}
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
            detailPanel={[
              {
                render: (rowData) => {
                  return <>{JSON.stringify(rowData)}</>;
                },
                icon: ()=> { return null }
              }
            ]}
          />
        </Grid>
        <Grid item xs={6}>
          <MaterialTable
            title="Option/Modifier Types"
            columns={[
              { title: "Name", field: "name" },
              { title: "Selection Type", field: "selection_type" },
              { title: "Ordinal", field: "ordinal" },
              { title: "EXID: Revel", field: "externalIDs.revelID" },
              { title: "EXID: Square", field: "externalIDs.sqID" },
            ]}
            options={{detailPanelType: "single"}}
            data={option_types}
            icons={tableIcons}
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
            detailPanel={[
              {
                render: (rowData) => {
                  return <>{JSON.stringify(rowData)}</>;
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
