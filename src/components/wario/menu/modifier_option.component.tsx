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
            <StringPropertyComponent
              disabled={isProcessing}
              label="Display Name"
              value={displayName}
              setValue={setDisplayName}
            />
          </Grid>
          <Grid item xs={6}>
            <StringPropertyComponent
              disabled={isProcessing}
              label="Description"
              value={description}
              setValue={setDescription}
            />
          </Grid>
          <Grid item xs={4}>
            <StringPropertyComponent
              disabled={isProcessing}
              label="Short Code"
              value={shortcode}
              setValue={setShortcode}
            />
          </Grid>
          <Grid item xs={4}>
            <IMoneyPropertyComponent
              disabled={isProcessing}
              label="Price"
              value={price}
              setValue={setPrice}
            />
          </Grid>
          <Grid item xs={4}>
            <IntNumericPropertyComponent
              disabled={isProcessing}
              label="Ordinal"
              value={ordinal}
              setValue={setOrdinal}
            />
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
            <FloatNumericPropertyComponent
              disabled={isProcessing}
              label="Flavor Max"
              value={flavorFactor}
              setValue={setFlavorFactor}
            />
          </Grid>
          <Grid item xs={3}>
            <FloatNumericPropertyComponent
              disabled={isProcessing}
              label="Bake Max"
              value={bakeFactor}
              setValue={setBakeFactor}
            />
          </Grid>
          <Grid item xs={4}>
            <ToggleBooleanPropertyComponent
              disabled={isProcessing}
              label="Can Split"
              value={canSplit}
              setValue={setCanSplit}
              labelPlacement='end'
            />
          </Grid>
          <Grid item xs={4}>
            <ToggleBooleanPropertyComponent
              disabled={isProcessing}
              label="Omit from shortname"
              value={omitFromShortname}
              setValue={setOmitFromShortname}
              labelPlacement='end'
            />
          </Grid>
          <Grid item xs={4}>
            <ToggleBooleanPropertyComponent
              disabled={isProcessing}
              label="Omit from name"
              value={omitFromName}
              setValue={setOmitFromName}
              labelPlacement='end'
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
