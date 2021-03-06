import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import catalog_import from "../../CATIMPORT.json";

import Autocomplete from "@material-ui/lab/Autocomplete";

import Button from "@material-ui/core/Button";
import LinearProgress from '@material-ui/core/LinearProgress';
import { useAuth0 } from '@auth0/auth0-react';

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

const ProductComponent = ({
  actions,
  progress,
  categories,
  parentCategories,
  setParentCategories,
}) => {
  const classes = useStyles();
  const actions_html =
    actions.length === 0 ? (
      ""
    ) : (
      <Grid container justify="flex-end" item xs={12}>
        {actions.map((action, idx) => (
          <Grid item key={idx}>
            {action}
          </Grid>
        ))}
      </Grid>
    );

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justify="center">
        <Grid item xs={12}>
          <Autocomplete
            multiple
            filterSelectedOptions
            options={Object.values(categories)}
            value={parentCategories.filter((x) => x)}
            onChange={(e, v) => setParentCategories(v)}
            getOptionLabel={(option) => option.category.name}
            getOptionSelected={(option, value) =>
              option.category._id === value.category._id
            }
            renderInput={(params) => (
              <TextField {...params} label="Categories" />
            )}
          />
        </Grid>
        {actions_html}
        {progress}
      </Grid>
    </div>
  );
};

const ProductAddContainer = ({ ENDPOINT, categories, onCloseCallback }) => {
  const [parentCategories, setParentCategories] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const addProducts = async (e) => {
    e.preventDefault();
    catalog_import.forEach(async (prod, ordinal) => {
      if (!isProcessing) {
        setIsProcessing(true);
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(`${ENDPOINT}/api/v1/menu/product/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              display_name: prod[0],
              description: prod[3],
              shortcode: prod[1],
              disabled: false,
              ordinal: ordinal,
              price: { amount: prod[2] * 100, currency: "USD" },
              revelID: "",
              squareID: "",
              category_ids: parentCategories.map(x => x.category._id),
              modifiers: [],
              create_product_instance: true
            }),
          });
          if (response.status === 201) {
          }
          setIsProcessing(false);
        } catch (error) {
          setIsProcessing(false);
        }
      }
    });
  };

  return (
    <ProductComponent 
      actions={[ 
        <Button
          className="btn btn-light"
          onClick={onCloseCallback}
          disabled={isProcessing}>
          Cancel
        </Button>,                 
        <Button
          className="btn btn-light"
          onClick={addProducts}
          disabled={isProcessing}
        >
          Add
        </Button>
      ]}
      progress={isProcessing ? <LinearProgress /> : "" }
      categories={categories}
      parentCategories={parentCategories}
      setParentCategories={setParentCategories}
    />
  );
};

export default ProductAddContainer;
