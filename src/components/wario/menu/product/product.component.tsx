import React from 'react';
import {
  Grid,
  TextField,
  Card,
  CardContent,
  Autocomplete,
  CardHeader
} from '@mui/material';
import DatetimeBasedDisableComponent, { IsDisableValueValid } from '../../datetime_based_disable.component';
import { ElementActionComponent } from '../element.action.component';
import { IMoney, IProductModifier, IWInterval, KeyValue, ReduceArrayToMapByKey } from '@wcp/wcpshared';
import { useAppSelector } from '../../../../hooks/useRedux';
import { ValSetValNamed } from '../../../../utils/common';
import { StringPropertyComponent } from '../../property-components/StringPropertyComponent';
import { FloatNumericPropertyComponent } from '../../property-components/FloatNumericPropertyComponent';
import { ToggleBooleanPropertyComponent } from '../../property-components/ToggleBooleanPropertyComponent';
import { IMoneyPropertyComponent } from '../../property-components/IMoneyPropertyComponent';
import { ExternalIdsExpansionPanelComponent } from '../../ExternalIdsExpansionPanelComponent';
import { getPrinterGroups } from '../../../../redux/slices/PrinterGroupSlice';

type ProductComponentPropsModeSpecific = (ValSetValNamed<string, 'baseProductId'> & { isEdit: true }) | ({ isEdit: false });
type ProductComponentFieldsNoBaseId =
  ValSetValNamed<IMoney, 'price'> &
  ValSetValNamed<KeyValue[], 'externalIds'> &
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
  ValSetValNamed<string|null, 'printerGroup'> &
  ValSetValNamed<IProductModifier[], 'modifiers'>;

interface ProductComponentProps {
  confirmText: string;
  onCloseCallback: VoidFunction;
  onConfirmClick: VoidFunction;
  isProcessing: boolean;
  disableConfirmOn: boolean;
  children?: React.ReactNode;
};

const ProductComponent = (props: ProductComponentPropsModeSpecific & ProductComponentFieldsNoBaseId & ProductComponentProps) => {
  const catalog = useAppSelector(s => s.ws.catalog!);
  const printerGroups = useAppSelector(s => ReduceArrayToMapByKey(getPrinterGroups(s.printerGroup.printerGroups), 'id'));
  const fulfillments = useAppSelector(s => s.ws.fulfillments!);


  const handleSetModifiers = (mods: string[]) => {
    const oldModsAsRecord = props.modifiers.reduce((acc, m) => ({ ...acc, [m.mtid]: m }), {} as Record<string, IProductModifier>)
    const sorted: IProductModifier[] = mods.sort((a, b) => catalog.modifiers[a].modifierType.ordinal - catalog.modifiers[b].modifierType.ordinal)
      .map(x => ({ mtid: x, serviceDisable: oldModsAsRecord[x]?.serviceDisable ?? [], enable: oldModsAsRecord[x]?.enable ?? null }));
    if (sorted.length === 0 && !props.showNameOfBaseProduct) {
      props.setShowNameOfBaseProduct(true);
    }
    props.setModifiers(sorted);
  };
  
  return (
    <ElementActionComponent
      onCloseCallback={props.onCloseCallback}
      onConfirmClick={props.onConfirmClick}
      isProcessing={props.isProcessing}
      disableConfirmOn={props.disableConfirmOn || !IsDisableValueValid(props.disabled)}
      confirmText={props.confirmText}
      body={
        <>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              filterSelectedOptions
              options={Object.keys(catalog.categories)}
              value={props.parentCategories}
              onChange={(e, v) => props.setParentCategories(v)}
              getOptionLabel={(option) => catalog.categories[option].category.name}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Categories" />}
            />
          </Grid>
          <Grid item xs={12}>
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
          {/* universal break */}
          <Grid item xs={6}>
            <IMoneyPropertyComponent
              disabled={props.isProcessing}
              label="Price"
              value={props.price}
              setValue={props.setPrice}
            />
          </Grid>
          <Grid item xs={6}>
            <StringPropertyComponent
              disabled={props.isProcessing}
              label="Singular Noun"
              value={props.singularNoun}
              setValue={props.setSingularNoun}
            />
          </Grid>
          <Grid item xs={12}>
            <ExternalIdsExpansionPanelComponent
              title='External IDs'
              disabled={props.isProcessing}
              value={props.externalIds}
              setValue={props.setExternalIds}
            />
          </Grid>
          {/* universal break */}
          <Grid item xs={4}>
            <FloatNumericPropertyComponent
              disabled={props.isProcessing}
              label="Flavor Max"
              value={props.flavorMax}
              setValue={props.setFlavorMax}
            />
          </Grid>
          <Grid item xs={4}>
            <FloatNumericPropertyComponent
              disabled={props.isProcessing}
              label="Bake Max"
              value={props.bakeMax}
              setValue={props.setBakeMax}
            />
          </Grid>
          <Grid item xs={4}>
            <FloatNumericPropertyComponent
              disabled={props.isProcessing}
              label="Bake Differential Max"
              value={props.bakeDifferentialMax}
              setValue={props.setBakeDifferentialMax}
            />
          </Grid>
          {/* universal break */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              filterSelectedOptions
              fullWidth
              options={Object.keys(catalog.productInstanceFunctions)}
              value={props.orderGuideSuggestionFunctions}
              onChange={(_, v) => props.setOrderGuideSuggestionFunctions(v)}
              getOptionLabel={(option) => catalog.productInstanceFunctions[option].name ?? 'CORRUPT DATA'}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Order Guide Suggestion Functions" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              filterSelectedOptions
              fullWidth
              options={Object.keys(catalog.productInstanceFunctions)}
              value={props.orderGuideWarningFunctions}
              onChange={(_, v) => props.setOrderGuideWarningFunctions(v)}
              getOptionLabel={(option) => catalog.productInstanceFunctions[option].name ?? 'CORRUPT DATA'}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Order Guide Warning Functions" />}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              filterSelectedOptions
              options={Object.keys(catalog.modifiers)}
              value={props.modifiers.map(x => x.mtid)}
              onChange={(e, v) => handleSetModifiers(v)}
              getOptionLabel={(option) => catalog.modifiers[option].modifierType.name ?? 'CORRUPT DATA'}
              isOptionEqualToValue={(o, v) => o === v}
              renderInput={(params) => <TextField {...params} label="Modifiers" />}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              filterSelectedOptions
              options={Object.keys(fulfillments)}
              value={props.serviceDisable}
              onChange={(_, v) => {
                props.setServiceDisable(v);
              }}
              getOptionLabel={(option) => fulfillments[option].displayName}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Disabled Services" />}
            />
          </Grid>
          <Grid item xs={12}>
            <ToggleBooleanPropertyComponent
              disabled={props.isProcessing || props.modifiers.length === 0}
              label="Show Name of Base Product Instead of Component Modifiers"
              value={props.showNameOfBaseProduct || props.modifiers.length === 0}
              setValue={props.setShowNameOfBaseProduct}
              labelPlacement='end'
            />
          </Grid>
          {props.modifiers.map((modifier, idx) => (
            <Grid item xs={12} md={props.modifiers.length - 1 === idx && props.modifiers.length % 2 === 1 ? 12 : 6} key={idx}>
              <Card>
                <CardHeader title={`Modifier Details: ${catalog.modifiers[modifier.mtid].modifierType.name}`} />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Autocomplete
                        fullWidth
                        options={Object.keys(catalog.productInstanceFunctions)}
                        value={modifier.enable}
                        // this makes a copy of the modifiers array with the updated enable function value
                        onChange={(_, v) => props.setModifiers(Object.assign([], props.modifiers, { [idx]: { ...modifier, enable: v } }))}
                        getOptionLabel={(option) => catalog.productInstanceFunctions[option].name ?? 'CORRUPT DATA'}
                        isOptionEqualToValue={(option, value) => option === value}
                        renderInput={(params) => <TextField {...params} label="Enable Function Name" />}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        fullWidth
                        multiple
                        filterSelectedOptions
                        options={Object.keys(fulfillments)}
                        value={modifier.serviceDisable}
                        onChange={(_, v) => props.setModifiers(Object.assign([], props.modifiers, { [idx]: { ...modifier, serviceDisable: v } }))}
                        getOptionLabel={(option) => fulfillments[option].displayName}
                        isOptionEqualToValue={(option, value) => option === value}
                        renderInput={(params) => <TextField {...params} label="Disabled Services" />}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>))}
          <Grid item xs={12}>
            <DatetimeBasedDisableComponent
              disabled={props.isProcessing}
              value={props.disabled}
              setValue={props.setDisabled}
            />
          </Grid>
          {props.children}
        </>
      }
    />
  );
};

export default ProductComponent;
