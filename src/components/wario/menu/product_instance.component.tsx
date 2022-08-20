import React, { useState } from "react";

import { Grid, TextField, FormControl, FormLabel, Card, CardContent, Checkbox, Radio, RadioGroup, FormGroup, FormControlLabel } from '@mui/material';

import { ElementActionComponent } from "./element.action.component";
import { useAppSelector } from "../../../hooks/useRedux";
import { ICatalogModifiers, IProduct, ModifiersMap, OptionPlacement, OptionQualifier, PriceDisplay } from "@wcp/wcpshared";
import { ValSetValNamed } from "../../../utils/common";
import { ToggleBooleanPropertyComponent } from "../property-components/ToggleBooleanPropertyComponent";
import { IntNumericPropertyComponent } from "../property-components/IntNumericPropertyComponent";
import { StringEnumPropertyComponent } from "../property-components/StringEnumPropertyComponent";

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

  const modifier_html = props.parent_product.modifiers.map((modifier_entry) => {
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
          {mt_options.map((option, oidx) => (
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
      <Grid item xs={6} key={mtid}>
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
      <Grid item xs={4}>
        <TextField
          label="Display Name"
          type="text"
          inputProps={{ size: 60 }}
          value={props.displayName}
          size="small"
          onChange={(e) => props.setDisplayName(e.target.value)}
        />
      </Grid>
      <Grid item xs={8}>
        <TextField
          label="Description"
          type="text"
          fullWidth
          inputProps={{ size: 60 }}
          value={props.description}
          size="small"
          onChange={(e) => props.setDescription(e.target.value)}
        />
      </Grid>
      <Grid item xs={3}>
        <IntNumericPropertyComponent
          disabled={props.isProcessing}
          label="Ordinal"
          value={props.ordinal}
          setValue={props.setOrdinal}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Short Code"
          type="text"
          value={props.shortcode}
          inputProps={{ size: 40 }}
          size="small"
          onChange={(e) => props.setShortcode(e.target.value)}
        />
      </Grid>
      <Grid item xs={3}>
        <ToggleBooleanPropertyComponent
          sx={{ ml: 1 }}
          disabled={props.isProcessing}
          label="Is Base"
          value={props.isBase}
          setValue={props.setIsBase}
          labelPlacement='end'
        />
      </Grid>
      <Grid item xs={2}>
        <IntNumericPropertyComponent
          disabled={props.isProcessing}
          label="Menu Ordinal"
          value={props.menuOrdinal}
          setValue={props.setMenuOrdinal}
        />
      </Grid>
      <Grid item xs={3} alignItems="center">
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Hide From Menu"
          value={props.menuHide}
          setValue={props.setMenuHide}
          labelPlacement='end'
        />
      </Grid>
      <Grid item xs={4}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Menu Suppress Exhaustive Modifier List"
          value={props.menuSuppressExhaustiveModifierList}
          setValue={props.setMenuSuppressExhaustiveModifierList}
          labelPlacement='end'
        />
      </Grid>
      <Grid item xs={3}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Show Modifier Options in Menu Display"
          value={props.menuShowModifierOptions}
          setValue={props.setMenuShowModifierOptions}
          labelPlacement='end'
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Menu Adornment (Optional, HTML allowed)"
          type="text"
          inputProps={{ size: 60 }}
          value={props.menuAdornment}
          size="small"
          onChange={(e) => props.setMenuAdornment(e.target.value)}
        />
      </Grid>
      <Grid container item xs={6}>
        <StringEnumPropertyComponent
          disabled={props.isProcessing}
          label="Menu Price Display"
          value={props.menuPriceDisplay}
          setValue={props.setMenuPriceDisplay}
          options={Object.keys(PriceDisplay)}
        />
      </Grid>
      <Grid item xs={2}>
        <IntNumericPropertyComponent
          disabled={props.isProcessing}
          label="Order Ordinal"
          value={props.orderOrdinal}
          setValue={props.setOrderOrdinal}
        />
      </Grid>
      <Grid item xs={3}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Hide From Order Menu"
          value={props.orderMenuHide}
          setValue={props.setOrderMenuHide}
          labelPlacement='end'
        />
      </Grid>
      <Grid item xs={4}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Order Menu Suppress Exhaustive Modifier List"
          value={props.orderSuppressExhaustiveModifierList}
          setValue={props.setOrderSuppressExhaustiveModifierList}
          labelPlacement='end'
        />
      </Grid>
      <Grid item xs={3}>
        <ToggleBooleanPropertyComponent
          disabled={props.isProcessing}
          label="Skip Customization"
          value={props.skipCustomization}
          setValue={props.setSkipCustomization}
          labelPlacement='end'
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Order Menu Adornment (Optional, HTML allowed)"
          type="text"
          inputProps={{ size: 60 }}
          value={props.orderAdornment}
          size="small"
          onChange={(e) => props.setOrderAdornment(e.target.value)}
        />
      </Grid>
      <Grid container item xs={6}>
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
