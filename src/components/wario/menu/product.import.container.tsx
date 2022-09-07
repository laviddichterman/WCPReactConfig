import React, { useState, Dispatch, SetStateAction } from "react";
import { Grid, TextField, Button, Autocomplete } from '@mui/material';

import { useCSVReader } from 'react-papaparse';

import { useAuth0 } from '@auth0/auth0-react';
import { ElementActionComponent } from "./element.action.component";
import { useAppSelector } from "../../../hooks/useRedux";
import { HOST_API } from "../../../config";
import { ProductAddRequestType } from "./product.add.container";
import { ParseResult } from "papaparse";

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
interface ProductComponentProps {
  confirmText: string;
  onCloseCallback: VoidFunction;
  onConfirmClick: VoidFunction;
  isProcessing: boolean;
  disableConfirmOn: boolean;
  parentCategories: string[];
  setParentCategories: Dispatch<SetStateAction<string[]>>;
  setFileData: Dispatch<SetStateAction<CSVProduct[]>>;
}
const ProductComponent = (props: ProductComponentProps) => {
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

const ProductAddContainer = ({ onCloseCallback }: { onCloseCallback: VoidFunction }) => {
  const [parentCategories, setParentCategories] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<CSVProduct[]>([])
  const { getAccessTokenSilently } = useAuth0();

  const addProducts = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      data.forEach(async (prod, index) => {
        const { Name, Description, Shortname, Price, ...others } = prod;
        const externalIds = Object.entries(others).map(([key, value]) => ({ key, value }));

        try {
          const token = await getAccessTokenSilently({ scope: "write:catalog" });
          const body: ProductAddRequestType = {
            displayName: Name, // displayName,
            description: Description || "",
            shortcode: Shortname,
            disabled: null,
            ordinal: index * 10,
            externalIDs: externalIds,
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
            modifiers: [],
            create_product_instance: true
          };
          const response = await fetch(`${HOST_API}/api/v1/menu/product/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
          // eslint-disable-next-line no-empty
          if (response.status === 201) {
          }
        } catch (error) {
          console.error(error);
        }
      });
    }
    setIsProcessing(false);
  };

  return (
    <ProductComponent
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

export default ProductAddContainer;
