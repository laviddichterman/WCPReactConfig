import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Autocomplete,
} from '@mui/material';
import DatetimeBasedDisableComponent, { IsDisableValueValid } from '../../datetime_based_disable.component';
import { ElementActionComponent } from '../element.action.component';
import { IMoney, IProductModifier, IRecurringInterval, IWInterval, KeyValue, PrepTiming, ReduceArrayToMapByKey } from '@wcp/wcpshared';
import { useAppSelector } from '../../../../hooks/useRedux';
import { ValSetValNamed } from '../../../../utils/common';
import { StringPropertyComponent } from '../../property-components/StringPropertyComponent';
import { FloatNumericPropertyComponent } from '../../property-components/FloatNumericPropertyComponent';
import { ToggleBooleanPropertyComponent } from '../../property-components/ToggleBooleanPropertyComponent';
import { IMoneyPropertyComponent } from '../../property-components/IMoneyPropertyComponent';
import { ExternalIdsExpansionPanelComponent } from '../../ExternalIdsExpansionPanelComponent';
import { getPrinterGroups } from '../../../../redux/slices/PrinterGroupSlice';
import ProductModifierComponent from "./ProductModifierComponent";
import RecurrenceRuleBuilderComponent from '../../RecurrenceRuleBuilderComponent';
import PrepTimingPropertyComponent from '../../PrepTimingPropertyComponent';


type ProductComponentPropsModeSpecific = (ValSetValNamed<string, 'baseProductId'> & { isEdit: true }) | ({ isEdit: false });
type ProductComponentFieldsNoBaseId =
  ValSetValNamed<IMoney, 'price'> &
  ValSetValNamed<KeyValue[], 'externalIds'> &
  ValSetValNamed<IWInterval | null, 'disabled'> &
  ValSetValNamed<IRecurringInterval | null, 'availability'> &
  ValSetValNamed<PrepTiming | null, 'timing'> &
  ValSetValNamed<string[], 'serviceDisable'> &
  ValSetValNamed<number, 'flavorMax'> &
  ValSetValNamed<number, 'bakeMax'> &
  ValSetValNamed<number, 'bakeDifferentialMax'> &
  ValSetValNamed<boolean, 'is3p'> &
  ValSetValNamed<string[], 'orderGuideWarningFunctions'> &
  ValSetValNamed<string[], 'orderGuideSuggestionFunctions'> &
  ValSetValNamed<boolean, 'showNameOfBaseProduct'> &
  ValSetValNamed<string, 'singularNoun'> &
  ValSetValNamed<string[], 'parentCategories'> &
  ValSetValNamed<string | null, 'printerGroup'> &
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
  const [availabilityIsValid, setAvailabilityIsValid] = useState(true);

  const handleSetModifiers = (mods: IProductModifier[]) => {
    if (mods.length === 0 && !props.showNameOfBaseProduct) {
      props.setShowNameOfBaseProduct(true);
    }
    props.setModifiers(mods);
  };

  return (
    <ElementActionComponent
      onCloseCallback={props.onCloseCallback}
      onConfirmClick={props.onConfirmClick}
      isProcessing={props.isProcessing}
      disableConfirmOn={props.disableConfirmOn || !IsDisableValueValid(props.disabled) || !availabilityIsValid}
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
          <Grid item xs={3}>
            <ToggleBooleanPropertyComponent
              disabled={props.isProcessing}
              label="Is 3rd Party"
              setValue={props.setIs3p}
              value={props.is3p}
              labelPlacement={'end'}
            />
          </Grid>
          <Grid item xs={9}>
            <ToggleBooleanPropertyComponent
              disabled={props.isProcessing || props.modifiers.length === 0}
              label="Show Name of Base Product Instead of Component Modifiers"
              value={props.showNameOfBaseProduct || props.modifiers.length === 0}
              setValue={props.setShowNameOfBaseProduct}
              labelPlacement='end'
            />
          </Grid>

          <Grid item xs={12}>
            <ProductModifierComponent isProcessing={props.isProcessing} modifiers={props.modifiers} setModifiers={handleSetModifiers} />
          </Grid>
          <Grid item xs={12}>
            <RecurrenceRuleBuilderComponent
              availabilityIsValid={availabilityIsValid}
              setAvailabilityIsValid={setAvailabilityIsValid}
              disabled={props.isProcessing}
              value={props.availability}
              setValue={props.setAvailability}
            />
          </Grid>
          <Grid item xs={12}>
            <PrepTimingPropertyComponent
              disabled={props.isProcessing}
              value={props.timing}
              setValue={props.setTiming}
            />
          </Grid>
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
