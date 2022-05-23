import React from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Autocomplete from '@mui/material/Autocomplete';
import CheckedInputComponent from "../checked_input.component";
import DatetimeBasedDisableComponent from "../datetime_based_disable.component";
import { ElementActionComponent } from "./element.action.component";

const ModifierOptionComponent = ({
  confirmText,
  onCloseCallback,
  onConfirmClick,
  isProcessing,
  product_instance_functions,
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
  setDisabled,
  revelID,
  setRevelID,
  squareID,
  setSquareID,
}) => (
    <ElementActionComponent 
      onCloseCallback={onCloseCallback}
      onConfirmClick={onConfirmClick}
      isProcessing={isProcessing}
      disableConfirmOn={displayName.length === 0 || shortcode.length === 0 ||
        price < 0 || flavorFactor < 0 || bakeFactor < 0 || isProcessing}
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
            <CheckedInputComponent
                label="Price"
                fullWidth={false}
                type="number"
                size="small"
                parseFunction={(e) => parseFloat(e).toFixed(2)}
                value={price}
                inputProps={{min:0.00}}
                onFinishChanging={(e) => setPrice(e)}
              />
          </Grid>
          <Grid item xs={4}>
            <CheckedInputComponent
              label="Ordinal"
              type="number"
              value={ordinal}
              inputProps={{ min: 0 }}
              onFinishChanging={(e) => setOrdinal(e)}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              style={{ width: 300 }}
              options={product_instance_functions}
              value={enableFunction}
              onChange={(e, v) => setEnableFunction(v)}
              getOptionLabel={(option) => option?.name ?? "CORRUPT DATA" }
              isOptionEqualToValue={(option, value) =>
                option &&
                value &&
                option._id === value._id
              }
              renderInput={(params) => <TextField {...params} label="Enable Function Name" />}
            />
          </Grid>
          <Grid item xs={3}>
            <CheckedInputComponent
              label="Flavor Factor"
              type="number"
              fullWidth
              value={flavorFactor}
              parseFunction={parseFloat}
              inputProps={{ min: 0, max: 63 }}
              onFinishChanging={(e) => setFlavorFactor(e)}
            />
          </Grid>
          <Grid item xs={3}>
            <CheckedInputComponent
              label="Bake Factor"
              type="number"
              fullWidth
              value={bakeFactor}
              parseFunction={parseFloat}
              inputProps={{ min: 0, max: 63 }}
              onFinishChanging={(e) => setBakeFactor(e)}
            />
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
          <Grid item xs={6}>
            <TextField
              label="Revel ID"
              type="text"
              inputProps={{ size: 40 }}
              value={revelID}
              size="small"
              onChange={(e) => setRevelID(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Square ID"
              type="text"
              inputProps={{ size: 40 }}
              value={squareID}
              size="small"
              onChange={(e) => setSquareID(e.target.value)}
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

export default ModifierOptionComponent;
