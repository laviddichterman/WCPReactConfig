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

import { useAuth0 } from "../../react-auth0-spa";
import CategoryComponent from "./category.component";



const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
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

const MenuBuilderComponent = ({ENDPOINT, categories}) => {
  const classes = useStyles();
  //const { getTokenSilently } = useAuth0();
  const categories_html = categories.map((category, i) => {
    return (
      <Container key={i}><ListItem>
      {category.name}
      </ListItem>
      <List component="div" className={classes.listLevel1}>
        {category.description}
      </List>
      </Container>
    );
})

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
        </Grid>
      </Paper>
      <Grid container justify="center" spacing={3}>
      <Paper className={classes.paper} >
            <AppBar position="static">
            <Toolbar><Typography variant="subtitle1" className={classes.title}>
            Catalog Tree View</Typography></Toolbar>
            </AppBar>
            {/* <TreeView
              className={classes.root}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              multiSelect
            >
              <TreeItem nodeId="1" label="Applications">
                <TreeItem nodeId="2" label="Calendar" />
                <TreeItem nodeId="3" label="Chrome" />
                <TreeItem nodeId="4" label="Webstorm" />
              </TreeItem>
              <TreeItem nodeId="5" label="Documents">
                <TreeItem nodeId="6" label="Material-UI">
                  <TreeItem nodeId="7" label="src">
                    <TreeItem nodeId="8" label="index.js" />
                    <TreeItem nodeId="9" label="tree-view.js" />
                  </TreeItem>
                </TreeItem>
              </TreeItem>
            </TreeView> */}

          </Paper>
      </Grid>
      <br />
    </div>
  );
};

export default MenuBuilderComponent;
