import { Grid, TextField, Autocomplete } from "@mui/material";
import { IMoney, IWInterval, RecordProductInstanceFunctions } from "@wcp/wcpshared";

import DatetimeBasedDisableComponent from "../datetime_based_disable.component";
import { ElementActionComponent } from "./element.action.component";
import { useAppSelector } from '../../../hooks/useRedux';
import { ValSetValNamed } from "../../../utils/common";
import { IMoneyPropertyComponent } from "../property-components/IMoneyPropertyComponent";
import { IntNumericPropertyComponent } from "../property-components/IntNumericPropertyComponent";
import { FloatNumericPropertyComponent } from "../property-components/FloatNumericPropertyComponent";
import { ToggleBooleanPropertyComponent } from "../property-components/ToggleBooleanPropertyComponent";
import { StringPropertyComponent } from "../property-components/StringPropertyComponent";

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

const ModifierOptionComponent = (props: ModifierOptionComponentProps) => {
  const productInstanceFunctions = useAppSelector(s => s.ws.catalog?.product_instance_functions) as RecordProductInstanceFunctions;
  return (
    <ElementActionComponent
      onCloseCallback={props.onCloseCallback}
      onConfirmClick={props.onConfirmClick}
      isProcessing={props.isProcessing}
      disableConfirmOn={props.displayName.length === 0 || props.shortcode.length === 0 ||
        props.price.amount < 0 || props.flavorFactor < 0 || props.bakeFactor < 0 || props.isProcessing}
      confirmText={props.confirmText}
      body={
        <>
          <Grid item xs={6}>
            <StringPropertyComponent
              disabled={props.isProcessing}
              label="Display Name"
              value={props.displayName}
              setValue={props.setDisplayName}
            />
          </Grid>
          <Grid item xs={6}>
            <StringPropertyComponent
              disabled={props.isProcessing}
              label="Description"
              value={props.description}
              setValue={props.setDescription}
            />
          </Grid>
          <Grid item xs={4}>
            <StringPropertyComponent
              disabled={props.isProcessing}
              label="Short Code"
              value={props.shortcode}
              setValue={props.setShortcode}
            />
          </Grid>
          <Grid item xs={4}>
            <IMoneyPropertyComponent
              disabled={props.isProcessing}
              label="Price"
              value={props.price}
              setValue={props.setPrice}
            />
          </Grid>
          <Grid item xs={4}>
            <IntNumericPropertyComponent
              disabled={props.isProcessing}
              label="Ordinal"
              value={props.ordinal}
              setValue={props.setOrdinal}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              style={{ width: 300 }}
              options={Object.keys(productInstanceFunctions)}
              value={props.enableFunction}
              onChange={(e, v) => props.setEnableFunction(v)}
              getOptionLabel={(option) => productInstanceFunctions[option].name ?? "CORRUPT DATA"}
              isOptionEqualToValue={(o, v) => o === v}
              renderInput={(params) => <TextField {...params} label="Enable Function Name" />}
            />
          </Grid>
          <Grid item xs={3}>
            <FloatNumericPropertyComponent
              disabled={props.isProcessing}
              label="Flavor Max"
              value={props.flavorFactor}
              setValue={props.setFlavorFactor}
            />
          </Grid>
          <Grid item xs={3}>
            <FloatNumericPropertyComponent
              disabled={props.isProcessing}
              label="Bake Max"
              value={props.bakeFactor}
              setValue={props.setBakeFactor}
            />
          </Grid>
          <Grid item xs={4}>
            <ToggleBooleanPropertyComponent
              disabled={props.isProcessing}
              label="Can Split"
              value={props.canSplit}
              setValue={props.setCanSplit}
              labelPlacement='end'
            />
          </Grid>
          <Grid item xs={4}>
            <ToggleBooleanPropertyComponent
              disabled={props.isProcessing}
              label="Omit from shortname"
              value={props.omitFromShortname}
              setValue={props.setOmitFromShortname}
              labelPlacement='end'
            />
          </Grid>
          <Grid item xs={4}>
            <ToggleBooleanPropertyComponent
              disabled={props.isProcessing}
              label="Omit from name"
              value={props.omitFromName}
              setValue={props.setOmitFromName}
              labelPlacement='end'
            />
          </Grid>
          <Grid item xs={12}>
            <DatetimeBasedDisableComponent
              disabled={props.disabled}
              setDisabled={props.setDisabled}
            />
          </Grid>
        </>
      }
    />
  );
}

export default ModifierOptionComponent;
