import React, { Dispatch, SetStateAction } from 'react';
import {
  Grid,
  TextField,
  Switch,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  FormControlLabel,
  Autocomplete
} from '@mui/material';
import DatetimeBasedDisableComponent from '../datetime_based_disable.component';
import { ElementActionComponent } from './element.action.component';
import { IMoney, IProductModifier, IWInterval, RoundToTwoDecimalPlaces } from '@wcp/wcpshared';
import { useAppSelector } from 'src/hooks/useRedux';
import { CheckedNumericInput } from '../CheckedNumericTextInput';
import { ValSetValNamed } from 'src/utils/common';

type ProductInstanceComponentProps = 
ValSetValNamed<string, 'displayName'> & 
ValSetValNamed<string, 'description'> & 
ValSetValNamed<string, 'shortcode'> & 
ValSetValNamed<number, 'ordinal'>;

type ProductComponentProps = 
ValSetValNamed<IMoney, 'price'> & 
ValSetValNamed<IWInterval | null, 'disabled'> & 
ValSetValNamed<string[], 'serviceDisable'> & 
ValSetValNamed<number, 'flavorMax'> & 
ValSetValNamed<number, 'bakeMax'> & 
ValSetValNamed<number, 'bakeDifferentialMax'> & 
ValSetValNamed<string[], 'orderGuideWarningFunctions'> & 
ValSetValNamed<string[], 'orderGuideSuggestionFunctions'> & 
ValSetValNamed<boolean, 'showNameOfBaseProduct'> & 
ValSetValNamed<string, 'singularNoun'> & 
ValSetValNamed<string[], 'parentCategories'> & 
ValSetValNamed<IProductModifier[], 'modifiers'> & {  
  confirmText: string;
  onCloseCallback: VoidFunction;
  onConfirmClick: VoidFunction;
  isProcessing: boolean;
  disableConfirmOn: boolean;
  children?: React.ReactNode;
};

type ProductComponentPropsTypes = (({ suppressNonProductInstanceFields: true; } & Partial<ProductInstanceComponentProps>) | ({ suppressNonProductInstanceFields: false; } & ProductInstanceComponentProps));

const ProductComponent = ({
  confirmText,
  onCloseCallback,
  onConfirmClick,
  isProcessing,
  disableConfirmOn,
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
  serviceDisable,
  setServiceDisable,
  ordinal,
  setOrdinal,
  flavorMax,
  setFlavorMax,
  bakeMax,
  setBakeMax,
  orderGuideWarningFunctions,
  setOrderGuideWarningFunctions,
  orderGuideSuggestionFunctions,
  setOrderGuideSuggestionFunctions,
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
  children
}: ProductComponentPropsTypes & ProductComponentProps) => {
  const catalog = useAppSelector(s => s.ws.catalog!);
  const fulfillments = useAppSelector(s => s.ws.fulfillments!);


  const handleSetModifiers = (mods: string[]) => {
    const oldModsAsRecord = modifiers.reduce((acc, m) => ({ ...acc, [m.mtid]: m }), {} as Record<string, IProductModifier>)
    const sorted: IProductModifier[] = mods.sort((a, b) => catalog.modifiers[a].modifier_type.ordinal - catalog.modifiers[b].modifier_type.ordinal)
      .map(x => ({ mtid: x, serviceDisable: oldModsAsRecord[x]?.serviceDisable ?? [], enable: oldModsAsRecord[x]?.enable ?? null }));
    if (sorted.length === 0 && !showNameOfBaseProduct) {
      setShowNameOfBaseProduct(true);
    }
    setModifiers(sorted);
  };

  const modifierEnableFunctionSpecificationList = modifiers.map((modifier, idx) => (
    <Grid item xs={6} key={idx}>
      <Card>
        <CardContent>
          <FormControl component="fieldset">
            <FormLabel>Modifier Details: {catalog.modifiers[modifier.mtid].modifier_type.name}</FormLabel>
            <Autocomplete
              style={{ width: 225 }}
              options={Object.keys(catalog.product_instance_functions)}
              value={modifier.enable}
              // this makes a copy of the modifiers array with the updated enable function value
              onChange={(_, v) => setModifiers(Object.assign([], modifiers, { [idx]: { ...modifier, enable: v } }))}
              getOptionLabel={(option) => catalog.product_instance_functions[option].name ?? 'CORRUPT DATA'}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Enable Function Name" />}
            />
            <Autocomplete
              multiple
              filterSelectedOptions
              options={Object.keys(fulfillments)}
              value={modifier.serviceDisable}
              onChange={(_, v) => setModifiers(Object.assign([], modifiers, { [idx]: { ...modifier, serviceDisable: v } }))}
              getOptionLabel={(option) => fulfillments[option].displayName}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Disabled Services" />}
            />
          </FormControl>
        </CardContent>
      </Card>
    </Grid>
  ));

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
              options={Object.keys(catalog.categories)}
              value={parentCategories}
              onChange={(e, v) => setParentCategories(v)}
              getOptionLabel={(option) => catalog.categories[option].category.name}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Categories" />}
            />
          </Grid>
          {!suppressNonProductInstanceFields && (
            <>
              <Grid item xs={5}>
                <TextField
                  label="Display Name"
                  type="text"
                  inputProps={{ size: 60 }}
                  value={displayName}
                  size="small"
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Description"
                  type="text"
                  inputProps={{ size: 60 }}
                  value={description}
                  size="small"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
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
            </>
          )}
          <Grid item xs={4}>
            <CheckedNumericInput
              type="number"
              label="Price"
              inputProps={{ inputMode: 'decimal', min: 0.0, max: 999999, pattern: '[0-9]+([.,][0-9]+)?', step: .25 }}
              value={price.amount / 100}
              disabled={isProcessing}
              onChange={(e) => setPrice({ ...price, amount: e * 100 })}
              parseFunction={(e) => RoundToTwoDecimalPlaces(parseFloat(e === null ? "0" : e))}
              allowEmpty={false} />
          </Grid>
          {!suppressNonProductInstanceFields && (
            <Grid item xs={2}>
              <TextField
                label="Short Code"
                type="text"
                inputProps={{ size: 40 }}
                value={shortcode}
                size="small"
                onChange={(e) => setShortcode(e.target.value)}
              />
            </Grid>
          )}
          <Grid item xs={2}>
            <CheckedNumericInput
              type="number"
              label="Flavor Max"
              inputProps={{ inputMode: 'decimal', min: 0, max: 99999, pattern: '[0-9]+([.,][0-9]+)?', step: 1 }}
              value={flavorMax}
              disabled={isProcessing}
              onChange={(e) => setFlavorMax(e)}
              parseFunction={parseFloat}
              allowEmpty={false} />
          </Grid>
          <Grid item xs={2}>
            <CheckedNumericInput
              type="number"
              label="Bake Max"
              inputProps={{ inputMode: 'decimal', min: 0, max: 99999, pattern: '[0-9]+([.,][0-9]+)?', step: 1 }}
              value={bakeMax}
              disabled={isProcessing}
              onChange={(e) => setBakeMax(e)}
              parseFunction={parseFloat}
              allowEmpty={false} />
          </Grid>
          <Grid item xs={2}>
            <CheckedNumericInput
              type="number"
              label="Bake Differential Max"
              inputProps={{ inputMode: 'decimal', min: 0, max: 99999, pattern: '[0-9]+([.,][0-9]+)?', step: 1 }}
              value={bakeDifferentialMax}
              disabled={isProcessing}
              onChange={(e) => setBakeDifferentialMax(e)}
              parseFunction={parseFloat}
              allowEmpty={false} />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              multiple
              filterSelectedOptions
              fullWidth
              options={Object.keys(catalog.product_instance_functions)}
              value={orderGuideSuggestionFunctions}
              onChange={(_, v) => setOrderGuideSuggestionFunctions(v)}
              getOptionLabel={(option) => catalog.product_instance_functions[option].name ?? 'CORRUPT DATA'}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Order Guide Suggestion Functions" />}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              multiple
              filterSelectedOptions
              fullWidth
              options={Object.keys(catalog.product_instance_functions)}
              value={orderGuideWarningFunctions}
              onChange={(_, v) => setOrderGuideWarningFunctions(v)}
              getOptionLabel={(option) => catalog.product_instance_functions[option].name ?? 'CORRUPT DATA'}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Order Guide Warning Functions" />}
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
              labelPlacement="end"
              label="Show Name of Base Product Instead of Component Modifiers"
            />
          </Grid>
          <Grid item xs={4}>
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
              options={Object.keys(catalog.modifiers)}
              value={modifiers.map(x => x.mtid)}
              onChange={(e, v) => handleSetModifiers(v)}
              getOptionLabel={(option) => catalog.modifiers[option].modifier_type.name ?? 'CORRUPT DATA'}
              isOptionEqualToValue={(o, v) => o === v}
              renderInput={(params) => <TextField {...params} label="Modifiers" />}
            />
          </Grid>
          {modifierEnableFunctionSpecificationList}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              filterSelectedOptions
              options={Object.keys(fulfillments)}
              value={serviceDisable}
              onChange={(_, v) => {
                setServiceDisable(v);
              }}
              getOptionLabel={(option) => fulfillments[option].displayName}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Disabled Services" />}
            />
          </Grid>
          <Grid item xs={12}>
            <DatetimeBasedDisableComponent disabled={disabled} setDisabled={setDisabled} />
          </Grid>
          {children}
        </>
      }
    />
  );
};

export default ProductComponent;
