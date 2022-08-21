import { useState } from "react";

import { Grid, FormControl, FormLabel, Card, CardContent, Checkbox, Radio, RadioGroup, FormGroup, FormControlLabel } from '@mui/material';

import { ElementActionComponent } from "./element.action.component";
import { useAppSelector } from "../../../hooks/useRedux";
import { ICatalogModifiers, IProduct, ModifiersMap, OptionPlacement, OptionQualifier, PriceDisplay } from "@wcp/wcpshared";
import { ValSetValNamed } from "../../../utils/common";
import { ToggleBooleanPropertyComponent } from "../property-components/ToggleBooleanPropertyComponent";
import { IntNumericPropertyComponent } from "../property-components/IntNumericPropertyComponent";
import { StringEnumPropertyComponent } from "../property-components/StringEnumPropertyComponent";
import { StringPropertyComponent } from "../property-components/StringPropertyComponent";

export type ProductInstanceComponentProps =
  ValSetValNamed<string, 'displayName'> &
  ValSetValNamed<string, 'description'> &
  ValSetValNamed<string, 'shortcode'> &
  ValSetValNamed<number, 'ordinal'> &
  ValSetValNamed<ModifiersMap, 'modifiers'> &
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
  }

const ProductInstanceComponent = (props: ProductInstanceComponentProps) => {
  const modifier_types_map = useAppSelector(s => s.ws.catalog?.modifiers ?? {});
  const handleToggle = (mtid: string, oidx: number) => {
    props.setModifiers({
      ...props.modifiers,
      [mtid]: Object.assign(
        [],
        props.modifiers[mtid],
        {
          [oidx]: {
            ...props.modifiers[mtid][oidx],
            placement: props.modifiers[mtid][oidx].placement === OptionPlacement.WHOLE ? OptionPlacement.NONE : OptionPlacement.WHOLE
          }
        })
    });
  };

  const handleRadioChange = (mtid: string, oidx: number) => {
    props.setModifiers({
      ...(props.modifiers),
      [mtid]: props.modifiers[mtid].map((opt, idx) =>
      ({
        optionId: opt.optionId,
        placement: idx === oidx ? OptionPlacement.WHOLE : OptionPlacement.NONE,
        qualifier: OptionQualifier.REGULAR
      }))
    });
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
          value={props.modifiers[mtid].findIndex(
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
                    props.modifiers[mtid][oidx].placement === OptionPlacement.WHOLE
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
      <Grid item xs={3} sm={2}>
        <IntNumericPropertyComponent
          disabled={props.isProcessing}
          label="Ordinal"
          value={props.ordinal}
          setValue={props.setOrdinal}
        />
      </Grid>
      <Grid item xs={5} sm={8}>
        <StringPropertyComponent
          disabled={props.isProcessing}
          label="Short Code"
          value={props.shortcode}
          setValue={props.setShortcode}
        />
      </Grid>
      <Grid item xs={4} sm={2}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Is Base"
          value={props.isBase}
          setValue={props.setIsBase}
          //labelPlacement='end'
        />
      </Grid>
      {/* universal break */}
      <Grid item xs={2} >
        <IntNumericPropertyComponent
          disabled={props.isProcessing}
          label="Menu Ordinal"
          value={props.menuOrdinal}
          setValue={props.setMenuOrdinal}
        />
      </Grid>
      <Grid item xs={10}>
        <StringPropertyComponent
          disabled={props.isProcessing}
          label="Menu Adornment (Optional, HTML allowed)"
          value={props.menuAdornment}
          setValue={props.setMenuAdornment}
        />
      </Grid>
      {/* universal break */}
      <Grid item xs={4} >
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Hide From Menu"
          value={props.menuHide}
          setValue={props.setMenuHide}
        />
      </Grid>
      <Grid item xs={4}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Menu Suppress Exhaustive Modifier List"
          value={props.menuSuppressExhaustiveModifierList}
          setValue={props.setMenuSuppressExhaustiveModifierList}
        />
      </Grid>
      <Grid item xs={4}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Show Modifier Options in Menu Display"
          value={props.menuShowModifierOptions}
          setValue={props.setMenuShowModifierOptions}
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
      <Grid item xs={2}>
        <IntNumericPropertyComponent
          disabled={props.isProcessing}
          label="Order Ordinal"
          value={props.orderOrdinal}
          setValue={props.setOrderOrdinal}
        />
      </Grid>
      <Grid item xs={10}>
        <StringPropertyComponent
          disabled={props.isProcessing}
          label="Order Menu Adornment (Optional, HTML allowed)"
          value={props.orderAdornment}
          setValue={props.setOrderAdornment}
        />
      </Grid>
      {/* universal break */}
      <Grid item xs={4}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Hide From Order Menu"
          value={props.orderMenuHide}
          setValue={props.setOrderMenuHide}
        />
      </Grid>
      <Grid item xs={4}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Order Menu Suppress Exhaustive Modifier List"
          value={props.orderSuppressExhaustiveModifierList}
          setValue={props.setOrderSuppressExhaustiveModifierList}
        />
      </Grid>
      <Grid item xs={4}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Skip Customization"
          value={props.skipCustomization}
          setValue={props.setSkipCustomization}
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
  minimizedModifiers: ModifiersMap
) => {
  return parent_product.modifiers.reduce(
    (acc, modifier_entry) => {
      const modOptions = minimizedModifiers[modifier_entry.mtid] ?? [];
      return {
        ...acc,
        [modifier_entry.mtid]: modifier_types_map[modifier_entry.mtid].options.map((option,) => {
          const foundOptionState = modOptions.find(x => x.optionId === option.id);
          return {
            optionId: option.id,
            placement: foundOptionState ? foundOptionState.placement : OptionPlacement.NONE,
            qualifier: foundOptionState ? foundOptionState.qualifier : OptionQualifier.REGULAR
          }
        })
      };
    }, {});
};

const minimizeModifiers = (normalized_modifiers: ModifiersMap) =>
  Object.entries(normalized_modifiers).reduce((acc, [mtid, options]) => {
    const filtered_options = options.filter(x => x.placement !== OptionPlacement.NONE);
    return filtered_options.length ? { ...acc, [mtid]: filtered_options } : acc;
  }, {});


export const ProductInstanceContainer = ({ parent_product, modifiers, setModifiers, ...otherProps }: ProductInstanceComponentProps) => {
  const modifier_types_map = useAppSelector(s => s.ws.catalog!.modifiers);
  const [normalizedModifers, setNormalizedModifiers] = useState<ModifiersMap>(normalizeModifiersAndOptions(parent_product, modifier_types_map, modifiers));

  const setNormalizedModifiersIntermediate = (mods: ModifiersMap) => {
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
