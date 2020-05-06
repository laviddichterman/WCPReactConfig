import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/Done";
import Button from "@material-ui/core/Button";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Toolbar from "@material-ui/core/Toolbar";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Container from "@material-ui/core/Container";
import { ListItemText } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { useAuth0 } from "../../react-auth0-spa";

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

const CategoryComponent = ({ ENDPOINT, categories }) => {
  const classes = useStyles();
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [parent, setParent] = useState(null);
  const [parentName, setParentName] = useState("");
  const [isProcessingAddCategory, setIsProcessingAddCategory] = useState(false);
  const { getTokenSilently } = useAuth0();

  const addCategory = async (e) => {
    e.preventDefault();

    if (!isProcessingAddCategory) {
      setIsProcessingAddCategory(true);
      try {
        const token = await getTokenSilently();
        const response = await fetch(`${ENDPOINT}/api/v1/menu/category`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: description,
            name: name,
            parent_id: parent ? parent._id : "",
          }),
        });
        setDescription("");
        setName("");
        setParent(null);
        setParentName("");
        setIsProcessingAddCategory(false);
      } catch (error) {
        console.error(error);
        setIsProcessingAddCategory(false);
      }
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="subtitle1" className={classes.title}>
                  Create a new category node:
                </Typography>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={5}>
            <TextField
              label="Category Name"
              type="text"
              inputProps={{ size: 30 }}
              value={name}
              size="small"
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={7}>
            <TextField
              label="Category Description"
              type="text"
              inputProps={{ size: 40 }}
              value={description}
              size="small"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={7}>
            <Autocomplete
              options={categories}
              value={parent}
              onChange={(e, v) => setParent(v)}
              inputValue={parentName}
              onInputChange={(e, v) => setParentName(v)}
              getOptionLabel={(option) => option.name}
              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Parent Category (Optional)" />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              className="btn btn-light"
              onClick={addCategory}
              disabled={name.length === 0 || description.length === 0}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default CategoryComponent;
