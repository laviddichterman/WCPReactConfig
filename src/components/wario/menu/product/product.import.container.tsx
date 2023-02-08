import React, { useState, Dispatch, SetStateAction } from "react";
import { Grid, TextField, Autocomplete } from '@mui/material';

import { ParseResult } from "papaparse";
import { IProductModifier, KeyValue, PriceDisplay, ReduceArrayToMapByKey } from "@wcp/wcpshared";
import { useSnackbar } from "notistack";
import { useAuth0 } from '@auth0/auth0-react';

import { ElementActionComponent } from "./../element.action.component";
import { useAppSelector } from "../../../../hooks/useRedux";
import { getPrinterGroups } from '../../../../redux/slices/PrinterGroupSlice';
import { HOST_API } from "../../../../config";
import { ProductAddRequestType } from "./product.add.container";
import { ValSetValNamed } from '../../../../utils/common';
import ProductModifierComponent from "./ProductModifierComponent";
import GenericCsvImportComponent from "../../generic_csv_import.component";

const delay = (ms : number) => new Promise(res => setTimeout(res, ms));

interface CSVProduct {
  Name: string;
  Description: string;
  Shortname: string;
  Price: string;
  [index: string]: string;
};

type ProductImportComponentProps = {
  confirmText: string;
  onCloseCallback: VoidFunction;
  onConfirmClick: VoidFunction;
  isProcessing: boolean;
  disableConfirmOn: boolean;
  setFileData: Dispatch<SetStateAction<CSVProduct[]>>;
} & ValSetValNamed<string[], 'parentCategories'> &
  ValSetValNamed<string | null, 'printerGroup'> &
  ValSetValNamed<IProductModifier[], 'modifiers'>;

const ProductImportComponent = (props: ProductImportComponentProps) => {
  const categories = useAppSelector(s => s.ws.catalog?.categories ?? {});
  const printerGroups = useAppSelector(s => ReduceArrayToMapByKey(getPrinterGroups(s.printerGroup.printerGroups), 'id'));
  return (
    <ElementActionComponent
      {...props}
      body={
        <>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
            <Autocomplete
              filterSelectedOptions
              options={Object.keys(printerGroups)}
              value={props.printerGroup}
              onChange={(e, v) => props.setPrinterGroup(v)}
              getOptionLabel={(pgId) => printerGroups[pgId].name ?? "Undefined"}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Printer Group" />}
            />
          </Grid>
          <Grid item xs={12}>
            <ProductModifierComponent isProcessing={props.isProcessing} modifiers={props.modifiers} setModifiers={props.setModifiers} />
          </Grid>
          <Grid item xs={12}>
            <GenericCsvImportComponent onAccepted={(data: ParseResult<CSVProduct>) => props.setFileData(data.data)} />
          </Grid>
        </>}
    />
  );
};

/**
 *  TODO: add modifier import container
 *  this allows selection of gin then picking the type of gin which would go in the same way a conversation would progress
 *  we could have product instances of Gin with As martini to start someone off in the gin martini mode for conversational ordering
 * 
 */
const ProductImportContainer = ({ onCloseCallback }: { onCloseCallback: VoidFunction }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [parentCategories, setParentCategories] = useState<string[]>([]);
  const [printerGroup, setPrinterGroup] = useState<string | null>(null);
  const [modifiers, setModifiers] = useState<IProductModifier[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<CSVProduct[]>([])
  const { getAccessTokenSilently } = useAuth0();

  const addProducts = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      for (let i = 0; i < data.length; ++i) {
        const { Name, Description, Shortname, Price, ...others } = data[i];
        const externalIds: KeyValue[] = Object.entries(others).filter(([_, value]) => value).map(([key, value]) => ({ key, value }));

        try {
          const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:catalog" } });
          const body: ProductAddRequestType = {
            instances: [{
              displayName: Name,
              modifiers: [],
              description: Description || "",
              externalIDs: externalIds,
              displayFlags: {
                hideFromPos: false,
                menu: {
                  adornment: "",
                  hide: false,
                  ordinal: i * 10,
                  show_modifier_options: false,
                  price_display: PriceDisplay.ALWAYS,
                  suppress_exhaustive_modifier_list: false
                },
                order: {
                  ordinal: i * 10,
                  adornment: '',
                  hide: false,
                  price_display: PriceDisplay.ALWAYS,
                  skip_customization: true,
                  suppress_exhaustive_modifier_list: false
                },
              },
              ordinal: i * 10,
              shortcode: Shortname,
            }],
            availability: null,
            disabled: null,
            externalIDs: [],
            serviceDisable: [],
            price: { amount: Number.parseFloat(Price) * 100, currency: "USD" },
            displayFlags: {
              is3p: false,
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
            printerGroup,
            modifiers
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
            await delay(1000);
          }
        } catch (error) {
          enqueueSnackbar(`Unable to import ${Name}. Got error: ${JSON.stringify(error, null, 2)}.`, { variant: "error" });
          console.error(error);
          setIsProcessing(false);
          onCloseCallback();
          return;
        }
      }
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
      printerGroup={printerGroup}
      setPrinterGroup={setPrinterGroup}
      modifiers={modifiers}
      setModifiers={setModifiers}
      setFileData={setData}
    />
  );
};

export default ProductImportContainer;
