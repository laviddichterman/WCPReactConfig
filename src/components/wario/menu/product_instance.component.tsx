import React, { Dispatch, SetStateAction, useState } from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";


// related to modifiers
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { ElementActionComponent } from "./element.action.component";
import { useAppSelector } from "src/hooks/useRedux";
import { ICatalogModifiers, IProduct, ModifiersMap, OptionPlacement, OptionQualifier, PriceDisplay } from "@wcp/wcpshared";
import { isUndefined, snakeCase, startCase } from "lodash";
import { CheckedNumericInput } from "../CheckedNumericTextInput";
import { ValSetValNamed } from "src/utils/common";

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
{ parent_product: IProduct; }

const ProductInstanceComponent = (props: ProductInstanceComponentProps) => {
  const modifier_types_map = useAppSelector(s => s.ws.catalog?.modifiers ?? {});
  const handleToggle = (mtid: string, oidx: number) => {
    props.setModifiers({
      ...props.modifiers,
      [mtid]: Object.assign(
        [], 
        props.modifiers[mtid], 
        {[oidx]: { 
          ...props.modifiers[mtid][oidx], 
          placement: props.modifiers[mtid][oidx].placement === OptionPlacement.WHOLE ? OptionPlacement.NONE : OptionPlacement.WHOLE 
        }})
    });
  };

  const handleRadioChange = (mtid: string, oidx: number) => {
    props.setModifiers({
      ...(props.modifiers),
      [mtid]: props.modifiers[mtid].map((opt, idx) =>
      ({
        optionId: opt.optionId,
        // eslint-disable-next-line
        placement: idx == oidx ? OptionPlacement.WHOLE : OptionPlacement.NONE,
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
        <CheckedNumericInput
          type="number"
          label="Ordinal"
          inputProps={{ inputMode: 'numeric', min: 0, max: 99999, pattern: '[0-9]*', step: 1 }}
          value={props.ordinal}
          onChange={props.setOrdinal}
          parseFunction={parseInt}
          allowEmpty={false} />

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
        <FormControlLabel
          control={
            <Switch
              sx={{ ml: 1 }}
              checked={props.isBase}
              onChange={(e) =>
                props.setIsBase(e.target.checked)
              }
              name="Is Base"
            />
          }
          label="Is Base"
        />
      </Grid>
      <Grid item xs={2}>
        <CheckedNumericInput
          type="number"
          label="Menu Ordinal"
          inputProps={{ inputMode: 'numeric', min: 0, max: 99999, pattern: '[0-9]*' }}
          value={props.menuOrdinal}
          onChange={props.setMenuOrdinal}
          parseFunction={parseInt}
          allowEmpty={false} />
      </Grid>
      <Grid item xs={3} alignItems="center">
        <FormControlLabel
          control={
            <Switch
              checked={props.menuHide}
              onChange={(e) =>
                props.setMenuHide(e.target.checked)
              }
              name="Hide From Menu"
            />
          }
          label="Hide From Menu"
        />
      </Grid>
      <Grid item xs={4}>
        <FormControlLabel
          control={
            <Switch
              checked={props.menuSuppressExhaustiveModifierList}
              onChange={(e) =>
                props.setMenuSuppressExhaustiveModifierList(e.target.checked)
              }
              name="Menu Suppress Exhaustive Modifier List"
            />
          }
          label="Menu Suppress Exhaustive Modifier List"
        />
      </Grid>
      <Grid item xs={3}>
        <FormControlLabel
          control={
            <Switch
              checked={props.menuShowModifierOptions}
              onChange={(e) =>
                props.setMenuShowModifierOptions(e.target.checked)
              }
              name="Show Modifier Options in Menu Display"
            />
          }
          label="Show Modifier Options in Menu Display"
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
        <FormControl component="fieldset">
          <FormLabel component="legend">Menu Price Display</FormLabel>
          <RadioGroup
            defaultValue={PriceDisplay.ALWAYS}
            aria-label="menu-price-display"
            name="menu-price-display"
            row
            value={props.menuPriceDisplay}
            onChange={(e) => props.setMenuPriceDisplay(e.target.value as keyof typeof PriceDisplay)}
          >
            {Object.keys(PriceDisplay).map((val, i) =>
              <FormControlLabel
                key={i}
                value={val}
                control={<Radio />}
                label={startCase(snakeCase(val))}
              />)}
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={2}>
        <CheckedNumericInput
          type="number"
          label="Order Ordinal"
          inputProps={{ inputMode: 'numeric', min: 0, max: 99999, pattern: '[0-9]*', step: 1 }}
          value={props.orderOrdinal}
          onChange={props.setOrderOrdinal}
          parseFunction={parseInt}
          allowEmpty={false} />
      </Grid>
      <Grid item xs={3}>
        <FormControlLabel
          control={
            <Switch
              checked={props.orderMenuHide}
              onChange={(e) =>
                props.setOrderMenuHide(e.target.checked)
              }
              name="Hide From Order Menu"
            />
          }
          label="Hide From Order Menu"
        />
      </Grid>
      <Grid item xs={4}>
        <FormControlLabel
          control={
            <Switch
              checked={props.orderSuppressExhaustiveModifierList}
              onChange={(e) =>
                props.setOrderSuppressExhaustiveModifierList(e.target.checked)
              }
              name="Order Menu Suppress Exhaustive Modifier List"
            />
          }
          label="Order Menu Suppress Exhaustive Modifier List"
        />
      </Grid>
      <Grid item xs={3}>
        <FormControlLabel
          control={
            <Switch
              checked={props.skipCustomization}
              onChange={(e) =>
                props.setSkipCustomization(e.target.checked)
              }
              name="Skip Customization"
            />
          }
          label="Skip Customization"
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
        <FormControl component="fieldset">
          <FormLabel component="legend">Order Menu Price Display</FormLabel>
          <RadioGroup
            defaultValue="ALWAYS"
            aria-label="order-menu-price-display"
            name="order-menu-price-display"
            row
            value={props.orderPriceDisplay}
            onChange={(e) => props.setOrderPriceDisplay(e.target.value as keyof typeof PriceDisplay)}
          >
            {Object.keys(PriceDisplay).map((val, i) =>
              <FormControlLabel
                key={i}
                value={val}
                control={<Radio />}
                label={startCase(snakeCase(val))}
              />)}
          </RadioGroup>
        </FormControl>
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
        displayName={displayName}
        shortcode={shortcode}
      />}
  />
)
