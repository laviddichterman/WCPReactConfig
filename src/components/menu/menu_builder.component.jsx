import React, { useState } from "react";

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
import TreeItem from "@material-ui/lab/TreeItem";

import { useAuth0 } from "../../react-auth0-spa";
import CategoryComponent from "./category.component";
import OptionComponent from "./option.component";

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

const MenuBuilderComponent = ({ ENDPOINT, categories, options, option_types }) => {
  const classes = useStyles();
  console.log(JSON.stringify(categories));
  //const { getTokenSilently } = useAuth0();

  const categories_dict = categories_list_to_dict(categories);
  const renderTree = (node) => {
    const children_html = node.children.map((child, i) => {
      return renderTree(categories_dict[child]);
    });
    return (
      <TreeItem
        nodeId={node.category._id}
        key={node.category._id}
        label={node.category.name}
      >
        {node.category.description}
        {children_html}
      </TreeItem>
    );
  };

  const categories_html = categories.map((category, i) => {
    if (category.parent_id != "") {
      return null;
    }
    return renderTree(categories_dict[category._id]);
  });
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
          <Grid item xs={12}>
            <CategoryComponent ENDPOINT={ENDPOINT} categories={categories} />
          </Grid>
          <Grid item xs={12}>
            <OptionComponent ENDPOINT={ENDPOINT} options={options} option_types={option_types} />
          </Grid>
        </Grid>
      </Paper>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="subtitle1" className={classes.title}>
                  Catalog Tree View
                </Typography>
              </Toolbar>
            </AppBar>
            <TreeView
              className={classes.category_tree}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              multiSelect
            >
              {categories_html}
            </TreeView>
          </Paper>
        </Grid>
      </Grid>
      <br />
    </div>
  );
};

export default MenuBuilderComponent;
