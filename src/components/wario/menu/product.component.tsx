import React from 'react';
import {
  Grid,
  TextField,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  Autocomplete
} from '@mui/material';
import DatetimeBasedDisableComponent from '../datetime_based_disable.component';
import { ElementActionComponent } from './element.action.component';
import { IMoney, IProductModifier, IWInterval } from '@wcp/wcpshared';
import { useAppSelector } from '../../../hooks/useRedux';
import { ValSetValNamed } from '../../../utils/common';
import { StringPropertyComponent } from '../property-components/StringPropertyComponent';
import { FloatNumericPropertyComponent } from '../property-components/FloatNumericPropertyComponent';
import { ToggleBooleanPropertyComponent } from '../property-components/ToggleBooleanPropertyComponent';
import { IntNumericPropertyComponent } from '../property-components/IntNumericPropertyComponent';
import { IMoneyPropertyComponent } from '../property-components/IMoneyPropertyComponent';

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
                <StringPropertyComponent
                  disabled={isProcessing}
                  label="Display Name"
                  value={displayName}
                  setValue={setDisplayName}
                />
              </Grid>
              <Grid item xs={5}>
                <StringPropertyComponent
                  disabled={isProcessing}
                  label="Description"
                  value={description}
                  setValue={setDescription}
                />
              </Grid>
              <Grid item xs={2}>
                <IntNumericPropertyComponent
                  disabled={isProcessing}
                  label="Ordinal"
                  value={ordinal}
                  setValue={setOrdinal}
                />
              </Grid>
            </>
          )}
          <Grid item xs={4}>
            <IMoneyPropertyComponent
              disabled={isProcessing}
              label="Price"
              value={price}
              setValue={setPrice}
            />
          </Grid>
          {!suppressNonProductInstanceFields && (
            <Grid item xs={2}>
              <StringPropertyComponent
                disabled={isProcessing}
                label="Short Code"
                value={shortcode}
                setValue={setShortcode}
              />
            </Grid>
          )}
          <Grid item xs={2}>
            <FloatNumericPropertyComponent
              disabled={isProcessing}
              label="Flavor Max"
              value={flavorMax}
              setValue={setFlavorMax}
            />
          </Grid>
          <Grid item xs={2}>
            <FloatNumericPropertyComponent
              disabled={isProcessing}
              label="Bake Max"
              value={bakeMax}
              setValue={setBakeMax}
            />
          </Grid>
          <Grid item xs={2}>
            <FloatNumericPropertyComponent
              disabled={isProcessing}
              label="Bake Differential Max"
              value={bakeDifferentialMax}
              setValue={setBakeDifferentialMax}
            />
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
            <ToggleBooleanPropertyComponent
              disabled={isProcessing || modifiers.length === 0}
              label="Show Name of Base Product Instead of Component Modifiers"
              value={showNameOfBaseProduct || modifiers.length === 0}
              setValue={setShowNameOfBaseProduct}
              labelPlacement='end'
            />
          </Grid>
          <Grid item xs={4}>
            <StringPropertyComponent
              disabled={isProcessing}
              label="Singular Noun"
              value={singularNoun}
              setValue={setSingularNoun}
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
