import React, { useState, Dispatch, SetStateAction } from "react";
import { Grid, TextField, Button, Autocomplete } from '@mui/material';

import { useCSVReader } from 'react-papaparse';
import { ParseResult } from "papaparse";
import { KeyValue, PriceDisplay } from "@wcp/wcpshared";
import { useSnackbar } from "notistack";
import { useAuth0 } from '@auth0/auth0-react';

import { ElementActionComponent } from "./element.action.component";
import { useAppSelector } from "../../../hooks/useRedux";
import { HOST_API } from "../../../config";
import { ProductAddRequestType } from "./product.add.container";


interface CSVProduct {
  Name: string;
  Description: string;
  Shortname: string;
  Price: string;
  [index: string]: string;
};

const InternalCSVReader = ({ onAccepted }: { onAccepted: (data: ParseResult<CSVProduct>) => void }) => {
  const { CSVReader } = useCSVReader();
  return (
    <CSVReader
      onUploadAccepted={onAccepted}
      config={{ header: true }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
      }: any) => (
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
            <Button disabled={!acceptedFile} variant="contained" {...getRemoveFileProps()} color="primary">
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
interface ProductImportComponentProps {
  confirmText: string;
  onCloseCallback: VoidFunction;
  onConfirmClick: VoidFunction;
  isProcessing: boolean;
  disableConfirmOn: boolean;
  parentCategories: string[];
  setParentCategories: Dispatch<SetStateAction<string[]>>;
  setFileData: Dispatch<SetStateAction<CSVProduct[]>>;
}
const ProductImportComponent = (props: ProductImportComponentProps) => {
  const categories = useAppSelector(s => s.ws.catalog?.categories ?? {});
  return (
    <ElementActionComponent
      {...props}
      body={
        <>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              filterSelectedOptions
              options={Object.keys(categories)}
              value={props.parentCategories.filter((x) => x)}
              onChange={(e, v) => props.setParentCategories(v)}
              getOptionLabel={(option) => categories[option].category.name}
              isOptionEqualToValue={(o, v) => o === v}
              renderInput={(params) => (
                <TextField {...params} label="Categories" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <InternalCSVReader onAccepted={(data) => props.setFileData(data.data)} />
          </Grid>
        </>}
    />
  );
};

const ProductImportContainer = ({ onCloseCallback }: { onCloseCallback: VoidFunction }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [parentCategories, setParentCategories] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<CSVProduct[]>([])
  const { getAccessTokenSilently } = useAuth0();

  const addProducts = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      data.forEach(async (prod, index) => {
        const { Name, Description, Shortname, Price, ...others } = prod;
        const externalIds: KeyValue[] = Object.entries(others).filter(([_, value]) => value).map(([key, value]) => ({ key, value }));

        try {
          const token = await getAccessTokenSilently({ scope: "write:catalog" });
          const body: ProductAddRequestType = {
            instance: {
              displayName: Name,
              modifiers: [],
              description: Description || "",
              externalIDs: externalIds,
              displayFlags: {
                menu: {
                  adornment: "",
                  hide: false,
                  ordinal: index * 10,
                  show_modifier_options: false,
                  price_display: PriceDisplay.ALWAYS,
                  suppress_exhaustive_modifier_list: false
                },
                order: {
                  ordinal: index * 10,
                  adornment: '',
                  hide: false,
                  price_display: PriceDisplay.ALWAYS,
                  skip_customization: true,
                  suppress_exhaustive_modifier_list: false
                }, 
              },
              ordinal: index * 10,
              shortcode: Shortname,
            },
            disabled: null,
            externalIDs: [],
            serviceDisable: [],
            price: { amount: Number.parseFloat(Price) * 100, currency: "USD" },
            displayFlags: {
              bake_differential: 100,
              show_name_of_base_product: true,
              flavor_max: 10,
              bake_max: 10,
              singular_noun: "",
              order_guide: {
                suggestions: [],
                warnings: []
              }
            },
            category_ids: parentCategories,
            modifiers: []
          };
          const response = await fetch(`${HOST_API}/api/v1/menu/product/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
          if (response.status === 201) {
            enqueueSnackbar(`Imported ${Name}.`);
          }
        } catch (error) {
          enqueueSnackbar(`Unable to import ${Name}. Got error: ${JSON.stringify(error)}.`, { variant: "error" });
          console.error(error);
        }
      });
    }
    setIsProcessing(false);
    onCloseCallback();
  };

  return (
    <ProductImportComponent
      confirmText="Import"
      onCloseCallback={onCloseCallback}
      onConfirmClick={() => addProducts()}
      isProcessing={isProcessing}
      disableConfirmOn={isProcessing || data.length === 0}
      parentCategories={parentCategories}
      setParentCategories={setParentCategories}
      setFileData={setData}
    />
  );
};

export default ProductImportContainer;
