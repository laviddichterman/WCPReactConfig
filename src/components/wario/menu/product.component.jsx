import React from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete from '@mui/material/Autocomplete';
import CheckedInputComponent from "../checked_input.component";
import DatetimeBasedDisableComponent from "../datetime_based_disable.component";
import { ElementActionComponent } from "./element.action.component";

const ProductComponent = ({
  confirmText,
  onCloseCallback,
  onConfirmClick,
  isProcessing,
  disableConfirmOn,
  modifier_types,
  categories,
  services,
  product_instance_functions,
  suppressNonProductInstanceFields,
  displayName,
  setDisplayName,
  description,
  setDescription,
  shortcode,
  setShortcode,
  price,
  setPrice,
  disabled,
  setDisabled,
  serviceDisabled,
  setServiceDisabled,
  ordinal,
  setOrdinal,
  revelID,
  setRevelID,
  squareID,
  setSquareID,
  flavorMax,
  setFlavorMax,
  bakeMax,
  setBakeMax,
  bakeDifferentialMax,
  setBakeDifferentialMax,
  showNameOfBaseProduct,
  setShowNameOfBaseProduct,
  singularNoun,
  setSingularNoun,
  parentCategories,
  setParentCategories,
  modifiers,
  setModifiers,
  // Object mapping MTID to enable function
  modifierEnableFunctions,
  setModifierEnableFunctions,
  children
}) => {
  const handleSetModifiers = (mods) => {
    const sorted = mods.sort((a, b) => a.modifier_type.ordinal - b.modifier_type.ordinal);
    if (sorted.length === 0 && !showNameOfBaseProduct) {
      setShowNameOfBaseProduct(true);
    }
    setModifiers(sorted);
  }

  const handleSetModifierEnableFunction = (mtid, enable) => {
    const newValue = {};
    Object.assign(newValue, modifierEnableFunctions);
    newValue[mtid] = enable;
    setModifierEnableFunctions(newValue);
  }

  const descriptionField = suppressNonProductInstanceFields ? (
    ""
  ) : (
    <Grid item xs={6}>
      <TextField
        label="Description"
        type="text"
        inputProps={{ size: 60 }}
        value={description}
        size="small"
        onChange={(e) => setDescription(e.target.value)}
      />
    </Grid>
  );

  const shortCodePriceRIDSID = suppressNonProductInstanceFields ? (
    ""
  ) : (
    <>
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
          className="form-control"
          type="number"
          size="small"
          parseFunction={(e) => parseFloat(e).toFixed(2)}
          value={price}
          inputProps={{ min: 0.0 }}
          onFinishChanging={(e) => setPrice(e)}
        />
      </Grid>
      <>
        <Grid item xs={4}>
          <TextField
            label="Revel ID"
            type="text"
            inputProps={{ size: 20 }}
            value={revelID}
            size="small"
            onChange={(e) => setRevelID(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Square ID"
            type="text"
            inputProps={{ size: 20 }}
            value={squareID}
            size="small"
            onChange={(e) => setSquareID(e.target.value)}
          />
        </Grid>
      </>
    </>
  );

  const modifierEnableFunctionSpecificationList = modifiers.map((modifier, idx) => (
      <Grid item xs={6} key={idx}>
        <Card>
          <CardContent>
            <FormControl component="fieldset">
              <FormLabel>Modifier Details: {modifier.modifier_type.name}</FormLabel>
              <Autocomplete
                style={{ width: 225 }}
                options={product_instance_functions}
                value={ modifierEnableFunctions[modifier.modifier_type._id] || null }
                onChange={(e, v) => handleSetModifierEnableFunction(modifier.modifier_type._id, v) }
                getOptionLabel={(option) => option?.name ?? "CORRUPT DATA"}
                isOptionEqualToValue={(option, value) => option && value && option._id === value._id }
                renderInput={(params) => (
                  <TextField {...params} label="Enable Function Name" />
                )}
              />
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
    )
  );

  return (
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
          <Grid item xs={6}>
            <TextField
              label="Display Name"
              type="text"
              inputProps={{ size: 60 }}
              value={displayName}
              size="small"
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Grid>
          {descriptionField}
          <Grid item xs={4}>
            <CheckedInputComponent
              label="Ordinal"
              type="number"
              value={ordinal}
              inputProps={{ min: 0 }}
              onFinishChanging={(e) => setOrdinal(e)}
            />
          </Grid>
          {shortCodePriceRIDSID}
          <Grid item xs={4}>
            <CheckedInputComponent
              label="Flavor Max"
              type="number"
              value={flavorMax}
              parseFunction={parseFloat}
              inputProps={{ min: 0 }}
              onFinishChanging={(e) => setFlavorMax(e)}
            />
          </Grid>
          <Grid item xs={4}>
            <CheckedInputComponent
              label="Bake Max"
              type="number"
              value={bakeMax}
              parseFunction={parseFloat}
              inputProps={{ min: 0 }}
              onFinishChanging={(e) => setBakeMax(e)}
            />
          </Grid>
          <Grid item xs={4}>
            <CheckedInputComponent
              label="Bake Differential Max"
              type="number"
              value={bakeDifferentialMax}
              parseFunction={parseFloat}
              inputProps={{ min: 0 }}
              onFinishChanging={(e) => setBakeDifferentialMax(e)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={showNameOfBaseProduct || modifiers.length === 0}
                  disabled={modifiers.length === 0}
                  onChange={(e) => setShowNameOfBaseProduct(e.target.checked)}
                  name="Show Name of Base Product Instead of Component Modifiers"
                />
              }
              labelPlacement="top"
              label="Show Name of Base Product Instead of Component Modifiers"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Singular Noun"
              type="text"
              value={singularNoun}
              size="small"
              onChange={(e) => setSingularNoun(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              filterSelectedOptions
              options={Object.values(modifier_types)}
              value={modifiers}
              onChange={(e, v) => handleSetModifiers(v) }
              getOptionLabel={(option) =>
                option ? option.modifier_type.name : "CORRUPT DATA"
              }
              isOptionEqualToValue={(option, value) =>
                option &&
                value &&
                option.modifier_type._id === value.modifier_type._id
              }
              renderInput={(params) => (
                <TextField {...params} label="Modifiers" />
              )}
            />
          </Grid>
          {modifierEnableFunctionSpecificationList}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              filterSelectedOptions
              options={Object.keys(services)}
              value={serviceDisabled.map(x=>String(x))}
              onChange={(e, v) => {setServiceDisabled(v.map(x=>Number(x)))}}
              getOptionLabel={(option) => services[option]}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => (
                <TextField {...params} label="Disabled Services" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <DatetimeBasedDisableComponent
              disabled={disabled}
              setDisabled={setDisabled}
            />
          </Grid>
          {children}
        </>}
    />
  );
};

export default ProductComponent;
