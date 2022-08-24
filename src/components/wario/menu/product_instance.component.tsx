import { useState } from "react";

import { Grid, FormControl, FormLabel, Card, CardContent, Checkbox, Radio, RadioGroup, FormGroup, FormControlLabel, useMediaQuery, useTheme } from '@mui/material';

import { ElementActionComponent } from "./element.action.component";
import { useAppSelector } from "../../../hooks/useRedux";
import { ICatalogModifiers, IProduct, ProductModifierEntry, OptionPlacement, OptionQualifier, PriceDisplay } from "@wcp/wcpshared";
import { ValSetValNamed } from "../../../utils/common";
import { ToggleBooleanPropertyComponent } from "../property-components/ToggleBooleanPropertyComponent";
import { IntNumericPropertyComponent } from "../property-components/IntNumericPropertyComponent";
import { StringEnumPropertyComponent } from "../property-components/StringEnumPropertyComponent";
import { StringPropertyComponent } from "../property-components/StringPropertyComponent";
import { cloneDeep } from "lodash";

export type ProductInstanceComponentProps =
  ValSetValNamed<string, 'displayName'> &
  ValSetValNamed<string, 'description'> &
  ValSetValNamed<string, 'shortcode'> &
  ValSetValNamed<number, 'ordinal'> &
  ValSetValNamed<ProductModifierEntry[], 'modifiers'> &
  ValSetValNamed<boolean, 'isBase'> &
  // menu
  ValSetValNamed<number, 'menuOrdinal'> &
  ValSetValNamed<boolean, 'menuHide'> &
  ValSetValNamed<keyof typeof PriceDisplay, 'menuPriceDisplay'> &
  ValSetValNamed<string, 'menuAdornment'> &
  ValSetValNamed<boolean, 'menuSuppressExhaustiveModifierList'> &
  ValSetValNamed<boolean, 'menuShowModifierOptions'> &
  // order
  ValSetValNamed<number, 'orderOrdinal'> &
  ValSetValNamed<boolean, 'orderMenuHide'> &
  ValSetValNamed<boolean, 'skipCustomization'> &
  ValSetValNamed<keyof typeof PriceDisplay, 'orderPriceDisplay'> &
  ValSetValNamed<string, 'orderAdornment'> &
  ValSetValNamed<boolean, 'orderSuppressExhaustiveModifierList'> &
  {
    parent_product: IProduct;
    isProcessing: boolean;
  };

const ProductInstanceComponent = (props: ProductInstanceComponentProps) => {
  const theme = useTheme();
  const useToggleEndLabel = !useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const modifier_types_map = useAppSelector(s => s.ws.catalog?.modifiers ?? {});
  const handleToggle = (mtid: string, oidx: number) => {
    const foundModifierEntryIndex = props.modifiers.findIndex(x => x.modifierTypeId === mtid);

    props.setModifiers([
      ...props.modifiers.slice(0, foundModifierEntryIndex),
      {
        modifierTypeId: mtid, options: [
          ...props.modifiers[foundModifierEntryIndex].options.slice(0, oidx),
          { ...props.modifiers[foundModifierEntryIndex].options[oidx], placement: props.modifiers[foundModifierEntryIndex].options[oidx].placement === OptionPlacement.WHOLE ? OptionPlacement.NONE : OptionPlacement.WHOLE },
          ...props.modifiers[foundModifierEntryIndex].options.slice(oidx + 1)]
      },
      ...props.modifiers.slice(foundModifierEntryIndex + 1)]);
  };

  const handleRadioChange = (mtid: string, oidx: number) => {
    const foundModifierEntryIndex = props.modifiers.findIndex(x => x.modifierTypeId === mtid);
    props.setModifiers([
      ...props.modifiers.slice(0, foundModifierEntryIndex),
      {
        modifierTypeId: mtid, options: props.modifiers[foundModifierEntryIndex].options.map((opt, idx) => (
        {
          optionId: opt.optionId,
          placement: idx === oidx ? OptionPlacement.WHOLE : OptionPlacement.NONE,
          qualifier: OptionQualifier.REGULAR

        }))
      },
      ...props.modifiers.slice(foundModifierEntryIndex + 1)]);
  };

  const modifier_html = props.parent_product.modifiers.map((modifier_entry, i) => {
    const { mtid } = modifier_entry;
    const mt = modifier_types_map[mtid].modifier_type;
    const mt_options = modifier_types_map[mtid].options;
    let mt_options_html;
    if (mt.min_selected === 1 && mt.max_selected === 1) {
      mt_options_html = (
        <RadioGroup
          aria-label={mt.id}
          name={mt.name}
          row
          value={props.modifiers.find(x => x.modifierTypeId === mtid)!.options.findIndex(
            (o) => o.placement === OptionPlacement.WHOLE
          )}
          onChange={(e) => handleRadioChange(mtid, parseInt(e.target.value))}
        >
          {mt_options.map((_, oidx) => (
            <FormControlLabel
              key={oidx}
              control={<Radio disableRipple />}
              value={oidx}
              label={mt_options[oidx].displayName}
            />
          ))}
        </RadioGroup>
      );
    } else {
      mt_options_html = (
        <FormGroup row>
          {mt_options.map((option, oidx) => (
            <FormControlLabel
              key={oidx}
              control={
                <Checkbox
                  checked={
                    props.modifiers.find(x => x.modifierTypeId === mtid)!.options[oidx].placement === OptionPlacement.WHOLE
                  }
                  onChange={() => handleToggle(mtid, oidx)}
                  disableRipple
                  inputProps={{ "aria-labelledby": String(oidx) }}
                />
              }
              label={option.displayName}
            />
          ))}
        </FormGroup>
      );
    }
    return (
      <Grid item xs={12} lg={(i === (props.parent_product.modifiers.length - 1) && props.parent_product.modifiers.length % 2 === 1) ? 12 : 6} key={mtid}>
        <Card>
          <CardContent>
            <FormControl component="fieldset">
              <FormLabel>{mt.name}</FormLabel>
              {mt_options_html}
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
    );
  });

  return (
    <>
      <Grid item xs={12} md={4}>
        <StringPropertyComponent
          disabled={props.isProcessing}
          label="Display Name"
          value={props.displayName}
          setValue={props.setDisplayName}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <StringPropertyComponent
          disabled={props.isProcessing}
          label="Description"
          value={props.description}
          setValue={props.setDescription}
        />
      </Grid>
      {/* universal break */}
      <Grid item xs={3} sm={2.5}>
        <IntNumericPropertyComponent
          disabled={props.isProcessing}
          label="Ordinal"
          value={props.ordinal}
          setValue={props.setOrdinal}
        />
      </Grid>
      <Grid item xs={6} sm={7}>
        <StringPropertyComponent
          disabled={props.isProcessing}
          label="Short Code"
          value={props.shortcode}
          setValue={props.setShortcode}
        />
      </Grid>
      <Grid item xs={3} sm={2.5} >
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Is Base"
          value={props.isBase}
          setValue={props.setIsBase}
          labelPlacement={"top"}
        />
      </Grid>
      {/* universal break */}
      <Grid item xs={3} sm={2.5}>
        <IntNumericPropertyComponent
          disabled={props.isProcessing}
          label="Menu Ordinal"
          value={props.menuOrdinal}
          setValue={props.setMenuOrdinal}
        />
      </Grid>
      <Grid item xs={9} sm={9.5}>
        <StringPropertyComponent
          disabled={props.isProcessing}
          label="Menu Adornment (Optional, HTML allowed)"
          value={props.menuAdornment}
          setValue={props.setMenuAdornment}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Menu Hide"
          value={props.menuHide}
          setValue={props.setMenuHide}
          labelPlacement={useToggleEndLabel ? "end" : "top"}
        />
      </Grid>
      {/* universal break */}
      <Grid item xs={12} sm={4}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Menu Suppress Exhaustive Modifiers"
          value={props.menuSuppressExhaustiveModifierList}
          setValue={props.setMenuSuppressExhaustiveModifierList}
          labelPlacement={useToggleEndLabel ? "end" : "top"}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Show Modifier Options in Menu Display"
          value={props.menuShowModifierOptions}
          setValue={props.setMenuShowModifierOptions}
          labelPlacement={useToggleEndLabel ? "end" : "top"}
        />
      </Grid>
      {/* universal break */}
      <Grid container item xs={12}>
        <StringEnumPropertyComponent
          disabled={props.isProcessing}
          label="Menu Price Display"
          value={props.menuPriceDisplay}
          setValue={props.setMenuPriceDisplay}
          options={Object.keys(PriceDisplay)}
        />
      </Grid>
      {/* universal break */}
      <Grid item xs={3} sm={2.5}>
        <IntNumericPropertyComponent
          disabled={props.isProcessing}
          label="Order Ordinal"
          value={props.orderOrdinal}
          setValue={props.setOrderOrdinal}
        />
      </Grid>
      <Grid item xs={9} sm={9.5}>
        <StringPropertyComponent
          disabled={props.isProcessing}
          label="Order Menu Adornment (Optional, HTML allowed)"
          value={props.orderAdornment}
          setValue={props.setOrderAdornment}
        />
      </Grid>
      {/* universal break */}
      <Grid item xs={12} sm={4}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Order Menu Hide"
          value={props.orderMenuHide}
          setValue={props.setOrderMenuHide}
          labelPlacement={useToggleEndLabel ? "end" : "top"}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Order Menu Suppress Exhaustive Modifiers"
          value={props.orderSuppressExhaustiveModifierList}
          setValue={props.setOrderSuppressExhaustiveModifierList}
          labelPlacement={useToggleEndLabel ? "end" : "top"}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Skip Customization"
          value={props.skipCustomization}
          setValue={props.setSkipCustomization}
          labelPlacement={useToggleEndLabel ? "end" : "top"}
        />
      </Grid>
      {/* universal break */}
      <Grid item container xs={12}>
        <StringEnumPropertyComponent
          disabled={props.isProcessing}
          label="Order Menu Price Display"
          value={props.orderPriceDisplay}
          setValue={props.setOrderPriceDisplay}
          options={Object.keys(PriceDisplay)}
        />
      </Grid>
      {modifier_html}
    </>
  );
};

const normalizeModifiersAndOptions = (
  parent_product: IProduct,
  modifier_types_map: ICatalogModifiers,
  minimizedModifiers: ProductModifierEntry[]
): ProductModifierEntry[] => {
  return parent_product.modifiers.map(
    (modifier_entry) => {
      const modEntry = minimizedModifiers.find(x => x.modifierTypeId === modifier_entry.mtid);
      const modOptions = modEntry ? modEntry.options : [];
      return {
        modifierTypeId: modifier_entry.mtid,
        options: modifier_types_map[modifier_entry.mtid].options.map((option) => {
          const foundOptionState = modOptions.find(x => x.optionId === option.id);
          return {
            optionId: option.id,
            placement: foundOptionState ? foundOptionState.placement : OptionPlacement.NONE,
            qualifier: foundOptionState ? foundOptionState.qualifier : OptionQualifier.REGULAR
          }
        })
      };
    });
};

const minimizeModifiers = (normalized_modifiers: ProductModifierEntry[]): ProductModifierEntry[] =>
  normalized_modifiers.reduce((acc, modifier) => {
    const filtered_options = modifier.options.filter(x => x.placement !== OptionPlacement.NONE);
    return filtered_options.length ? [...acc, { ...modifier, options: filtered_options }] : acc;
  }, []);


export const ProductInstanceContainer = ({ parent_product, modifiers, setModifiers, ...otherProps }: ProductInstanceComponentProps) => {
  const modifier_types_map = useAppSelector(s => s.ws.catalog!.modifiers);
  const [normalizedModifers, setNormalizedModifiers] = useState<ProductModifierEntry[]>(normalizeModifiersAndOptions(parent_product, modifier_types_map, modifiers));

  const setNormalizedModifiersIntermediate = (mods: ProductModifierEntry[]) => {
    setNormalizedModifiers(mods);
    setModifiers(minimizeModifiers(mods));
  };

  return (
    <ProductInstanceComponent
      parent_product={parent_product}
      modifiers={normalizedModifers}
      setModifiers={setNormalizedModifiersIntermediate}
      {...otherProps}
    />
  );
};

interface ProductInstanceActionContainerProps {
  confirmText: string;
  onCloseCallback: VoidFunction;
  onConfirmClick: VoidFunction;
  isProcessing: boolean;
  displayName: string;
  shortcode: string;
}

export const ProductInstanceActionContainer = ({
  confirmText,
  onCloseCallback,
  onConfirmClick,
  isProcessing,
  displayName,
  shortcode,
  ...otherProps
}: ProductInstanceActionContainerProps & ProductInstanceComponentProps) => (
  <ElementActionComponent
    onCloseCallback={onCloseCallback}
    onConfirmClick={onConfirmClick}
    isProcessing={isProcessing}
    disableConfirmOn={displayName.length === 0 || shortcode.length === 0 || isProcessing}
    confirmText={confirmText}
    body={
      <ProductInstanceContainer
        {...otherProps}
        isProcessing={isProcessing}
        displayName={displayName}
        shortcode={shortcode}
      />}
  />
)
