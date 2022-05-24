import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import Autocomplete from '@mui/material/Autocomplete';
import { useCSVReader } from 'react-papaparse';

import Button from "@mui/material/Button";
import { useAuth0 } from '@auth0/auth0-react';
import { ElementActionComponent } from "./element.action.component";


const InternalCSVReader = ({onAccepted}) => {
  const { CSVReader } = useCSVReader();
  return (
    <CSVReader
      onUploadAccepted={onAccepted}
      config={{header:true}}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
      }) => (
        <Grid container>
          <Grid item xs={4}>
            <Button variant="contained" {...getRootProps()} color="primary">
              Browse for CSV
            </Button>
          </Grid>
          <Grid item xs={5}>
            {acceptedFile && acceptedFile.name}
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" {...getRemoveFileProps()} color="primary">
              Remove
            </Button>
          </Grid>
          <Grid item xs={12}>
            <ProgressBar />
          </Grid>
        </Grid>
      )}
    </CSVReader>
  );
};

const ProductComponent = ({
  confirmText,
  onCloseCallback,
  onConfirmClick,
  isProcessing,
  disableConfirmOn,
  categories,
  parentCategories,
  setParentCategories,
  setFileData,
}) => (
    <ElementActionComponent 
    onCloseCallback={onCloseCallback}
    onConfirmClick={onConfirmClick}
    isProcessing={isProcessing}
    disableConfirmOn={disableConfirmOn}
    confirmText={confirmText}
    body={
    <>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            filterSelectedOptions
            options={Object.values(categories)}
            value={parentCategories.filter((x) => x)}
            onChange={(e, v) => setParentCategories(v)}
            getOptionLabel={(option) => option.category.name}
            isOptionEqualToValue={(option, value) =>
              option.category._id === value.category._id
            }
            renderInput={(params) => (
              <TextField {...params} label="Categories" />
            )}
          />
        </Grid>
        <Grid item xs={12}>
        <InternalCSVReader onAccepted={(e) => setFileData(e)} />
        </Grid>
    </>}
    />
  );

const ProductAddContainer = ({ ENDPOINT, categories, onCloseCallback }) => {
  const [parentCategories, setParentCategories] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState()
  const { getAccessTokenSilently } = useAuth0();

  const addProducts = async (e) => {
    e.preventDefault();
    data.data.forEach(async (prod, index) => {
      if (!isProcessing) {
        setIsProcessing(true);
        try {
          const token = await getAccessTokenSilently( { scope: "write:catalog"} );
          const response = await fetch(`${ENDPOINT}/api/v1/menu/product/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            /**
             *               
              display_name: prod[0],
              description: prod[3],
              shortcode: prod[1],
              price: { amount: prod[2] * 100, currency: "USD" },
             */
            body: JSON.stringify({
              display_name: prod.Name, // displayName,
              description: prod.Description || "",
              shortcode: prod.Shortname,
              disabled: null,
              ordinal: index * 10,
              price: { amount: Number.parseFloat(prod.Price) * 100, currency: "USD" },
              display_flags: {
                bake_differential: 100,
                show_name_of_base_product: true,
                flavor_max: 10,
                bake_max: 10,
                singular_noun: "",
              },
              revelID: "",
              squareID: "",
              category_ids: parentCategories.map(x => x.category._id),
              modifiers: [],
              create_product_instance: true
            }),
          });
          // eslint-disable-next-line no-empty
          if (response.status === 201) {
          }
          setIsProcessing(false);
        } catch (error) {
          console.error(error);
          setIsProcessing(false);
        }
      }
    });
  };

  return (
    <ProductComponent 
      confirmText="Import"
      onCloseCallback={onCloseCallback}
      onConfirmClick={addProducts}
      isProcessing={isProcessing}
      disableConfirmOn={isProcessing || !data || data.data.length === 0}
      categories={categories}
      parentCategories={parentCategories}
      setParentCategories={setParentCategories}
      setFileData={setData}
    />
  );
};

export default ProductAddContainer;
