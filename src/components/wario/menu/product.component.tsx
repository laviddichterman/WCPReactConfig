import React, { Dispatch, SetStateAction } from 'react';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import DatetimeBasedDisableComponent from '../datetime_based_disable.component';
import { ElementActionComponent } from './element.action.component';
import { IMoney, IWInterval, RoundToTwoDecimalPlaces } from '@wcp/wcpshared';
import { useAppSelector } from 'src/hooks/useRedux';
import { CheckedNumericInput } from '../CheckedNumericTextInput';

interface ProductInstanceComponentProps {
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  shortcode: string;
  setShortcode: Dispatch<SetStateAction<string>>;
  ordinal: number;
  setOrdinal: Dispatch<SetStateAction<number>>;
}

interface ProductComponentProps {
  confirmText: string;
  onCloseCallback: VoidFunction;
  onConfirmClick: VoidFunction;
  isProcessing: boolean;
  disableConfirmOn: boolean;
  price: IMoney;
  setPrice: Dispatch<SetStateAction<IMoney>>;
  disabled: IWInterval | null;
  setDisabled: Dispatch<SetStateAction<IWInterval | null>>;
  serviceDisabled: number[];
  setServiceDisabled: Dispatch<SetStateAction<number[]>>;
  flavorMax: number;
  setFlavorMax: Dispatch<SetStateAction<number>>;
  bakeMax: number;
  setBakeMax: Dispatch<SetStateAction<number>>;
  bakeDifferentialMax: number;
  setBakeDifferentialMax: Dispatch<SetStateAction<number>>;
  showNameOfBaseProduct: boolean;
  setShowNameOfBaseProduct: Dispatch<SetStateAction<boolean>>;
  singularNoun: string;
  setSingularNoun: Dispatch<SetStateAction<string>>;
  parentCategories: string[];
  setParentCategories: Dispatch<SetStateAction<string[]>>;
  modifiers: { mtid: string, enable: string | null }[]
  setModifiers: Dispatch<SetStateAction<{ mtid: string, enable: string | null }[]>>;
  children?: React.ReactNode;
}
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
  serviceDisabled,
  setServiceDisabled,
  ordinal,
  setOrdinal,
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
  children
}: ProductComponentPropsTypes & ProductComponentProps) => {
  const catalog = useAppSelector(s => s.ws.catalog);
  const services = useAppSelector(s => s.ws.services);
  if (catalog === null || services === null) {
    return <>Loading...</>;
  }

  const handleSetModifiers = (mods: string[]) => {
    const oldModsAsRecord = modifiers.reduce((acc, m) => ({ ...acc, [m.mtid]: m.enable }), {} as Record<string, string | null>)
    const sorted = mods.sort((a, b) => catalog.modifiers[a].modifier_type.ordinal - catalog.modifiers[b].modifier_type.ordinal)
      .map(x => ({ mtid: x, enable: oldModsAsRecord[x] ?? null }));
    if (sorted.length === 0 && !showNameOfBaseProduct) {
      setShowNameOfBaseProduct(true);
    }
    setModifiers(sorted);
  };

  const displayNameDescriptionOrdinalFields = suppressNonProductInstanceFields ? (
    ''
  ) : (
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
  );

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
          {displayNameDescriptionOrdinalFields}
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
          {suppressNonProductInstanceFields ? (
            ''
          ) : (
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
              inputProps={{ inputMode: 'numeric', min: 0, max: 99999, pattern: '[0-9]+([.,][0-9]+)?', step: 1 }}
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
              inputProps={{ inputMode: 'numeric', min: 0, max: 99999, pattern: '[0-9]+([.,][0-9]+)?', step: 1 }}
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
              inputProps={{ inputMode: 'numeric', min: 0, max: 99999, pattern: '[0-9]+([.,][0-9]+)?', step: 1 }}
              value={bakeDifferentialMax}
              disabled={isProcessing}
              onChange={(e) => setBakeDifferentialMax(e)}
              parseFunction={parseFloat}
              allowEmpty={false} />
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
              options={Object.keys(services)}
              value={serviceDisabled.map((x) => String(x))}
              onChange={(e, v) => {
                setServiceDisabled(v.map((x) => Number(x)));
              }}
              getOptionLabel={(option) => services[option]}
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
