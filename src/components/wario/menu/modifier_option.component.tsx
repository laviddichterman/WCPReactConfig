import React, { Dispatch, SetStateAction } from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Autocomplete from '@mui/material/Autocomplete';
import DatetimeBasedDisableComponent from "../datetime_based_disable.component";
import { ElementActionComponent } from "./element.action.component";
import { IMoney, IWInterval, RecordProductInstanceFunctions, RoundToTwoDecimalPlaces } from "@wcp/wcpshared";
import { useAppSelector } from '../../../hooks/useRedux';
import { CheckedNumericInput } from "../CheckedNumericTextInput";
import { ValSetValNamed } from "src/utils/common";

type ModifierOptionComponentProps = 
ValSetValNamed<string, 'displayName'> & 
ValSetValNamed<string, 'description'> & 
ValSetValNamed<string, 'shortcode'> & 
ValSetValNamed<number, 'ordinal'> & 
ValSetValNamed<IMoney, 'price'> & 
ValSetValNamed<string | null, 'enableFunction'> & 
ValSetValNamed<number, 'flavorFactor'> & 
ValSetValNamed<number, 'bakeFactor'> & 
ValSetValNamed<boolean, 'canSplit'> & 
ValSetValNamed<boolean, 'omitFromShortname'> & 
ValSetValNamed<boolean, 'omitFromName'> & 
ValSetValNamed<IWInterval | null, 'disabled'> & 
{
  confirmText: string
  onCloseCallback: VoidFunction;
  onConfirmClick: VoidFunction;
  isProcessing: boolean;
}

const ModifierOptionComponent = ({
  confirmText,
  onCloseCallback,
  onConfirmClick,
  isProcessing,
  displayName,
  setDisplayName,
  description,
  setDescription,
  shortcode,
  setShortcode,
  ordinal,
  setOrdinal,
  price,
  setPrice,
  enableFunction,
  setEnableFunction,
  flavorFactor,
  setFlavorFactor,
  bakeFactor,
  setBakeFactor,
  canSplit,
  setCanSplit,
  omitFromShortname,
  setOmitFromShortname,
  omitFromName,
  setOmitFromName,
  disabled,
  setDisabled
}: ModifierOptionComponentProps) => {
  const productInstanceFunctions = useAppSelector(s => s.ws.catalog?.product_instance_functions) as RecordProductInstanceFunctions;
  return (
    <ElementActionComponent
      onCloseCallback={onCloseCallback}
      onConfirmClick={onConfirmClick}
      isProcessing={isProcessing}
      disableConfirmOn={displayName.length === 0 || shortcode.length === 0 ||
        price.amount < 0 || flavorFactor < 0 || bakeFactor < 0 || isProcessing}
      confirmText={confirmText}
      body={
        <>
          <Grid item xs={6}>
            <TextField
              label="Display Name"
              type="text"
              inputProps={{ size: 40 }}
              value={displayName}
              size="small"
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Description"
              type="text"
              fullWidth
              inputProps={{ size: 40 }}
              value={description}
              size="small"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Short Code"
              type="text"
              inputProps={{ size: 40 }}
              value={shortcode}
              size="small"
              onChange={(e) => setShortcode(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <CheckedNumericInput
              type="number"
              label="Price"
              inputProps={{ inputMode: 'numeric', min: 0.0, max: 999999, pattern: '[0-9]+([.,][0-9]+)?', step: .25 }}
              value={price.amount / 100}
              disabled={isProcessing}
              onChange={(e) => setPrice({ ...price, amount: e * 100 })}
              parseFunction={(e) => RoundToTwoDecimalPlaces(parseFloat(e === null ? "0" : e))}
              allowEmpty={false} />
          </Grid>
          <Grid item xs={4}>
            <CheckedNumericInput
              label="Ordinal"
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0, max: 43200, pattern: '[0-9]*', step: 1 }}
              value={ordinal}
              disabled={isProcessing}
              onChange={(e) => setOrdinal(e)}
              parseFunction={parseInt}
              allowEmpty={false} />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              style={{ width: 300 }}
              options={Object.keys(productInstanceFunctions)}
              value={enableFunction}
              onChange={(e, v) => setEnableFunction(v)}
              getOptionLabel={(option) => productInstanceFunctions[option].name ?? "CORRUPT DATA"}
              isOptionEqualToValue={(o, v) => o === v}
              renderInput={(params) => <TextField {...params} label="Enable Function Name" />}
            />
          </Grid>
          <Grid item xs={3}>
            <CheckedNumericInput
              label="Flavor Factor"
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0, max: 43200, pattern: '[0-9]+([.,][0-9]+)?', step: 1 }}
              value={flavorFactor}
              disabled={isProcessing}
              onChange={(e) => setFlavorFactor(e)}
              parseFunction={parseFloat}
              allowEmpty={false} />
          </Grid>
          <Grid item xs={3}>
            <CheckedNumericInput
              label="Bake Factor"
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0, max: 43200, pattern: '[0-9]+([.,][0-9]+)?', step: 1 }}
              value={bakeFactor}
              disabled={isProcessing}
              onChange={(e) => setBakeFactor(e)}
              parseFunction={parseFloat}
              allowEmpty={false} />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={canSplit}
                  onChange={e => setCanSplit(e.target.checked)}
                  name="Can Split"
                />
              }
              label="Can Split"
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={omitFromShortname}
                  onChange={e => setOmitFromShortname(e.target.checked)}
                  name="Omit from shortname"
                />
              }
              label="Omit from shortname"
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={omitFromName}
                  onChange={e => setOmitFromName(e.target.checked)}
                  name="Omit from name"
                />
              }
              label="Omit from name"
            />
          </Grid>
          <Grid item xs={12}>
            <DatetimeBasedDisableComponent
              disabled={disabled}
              setDisabled={setDisabled}
            />
          </Grid>
        </>
      }
    />
  );
}

export default ModifierOptionComponent;
