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
import { ICatalogModifiers, IProduct, IWModifiersInstance, IWOptionInstance, PriceDisplay } from "@wcp/wcpshared";
import { isUndefined } from "lodash";
import { CheckedNumericInput } from "../CheckedNumericTextInput";

export interface ProductInstanceComponentProps {
  parent_product: IProduct;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  shortcode: string;
  setShortcode: Dispatch<SetStateAction<string>>;
  ordinal: number;
  setOrdinal: Dispatch<SetStateAction<number>>;
  revelID: string;
  setRevelID: Dispatch<SetStateAction<string>>;
  squareID: string;
  setSquareID: Dispatch<SetStateAction<string>>;
  modifiers: IWModifiersInstance[];
  setModifiers: Dispatch<SetStateAction<IWModifiersInstance[]>>;
  isBase: boolean;
  setIsBase: Dispatch<SetStateAction<boolean>>;
  // menu
  menuOrdinal: number;
  setMenuOrdinal: Dispatch<SetStateAction<number>>;
  menuHide: boolean;
  setMenuHide: Dispatch<SetStateAction<boolean>>;
  menuPriceDisplay: keyof typeof PriceDisplay;
  setMenuPriceDisplay: Dispatch<SetStateAction<keyof typeof PriceDisplay>>;
  menuAdornment: string;
  setMenuAdornment: Dispatch<SetStateAction<string>>;
  menuSuppressExhaustiveModifierList: boolean;
  setMenuSuppressExhaustiveModifierList: Dispatch<SetStateAction<boolean>>;
  menuShowModifierOptions: boolean;
  setMenuShowModifierOptions: Dispatch<SetStateAction<boolean>>;
  // order
  orderOrdinal: number;
  setOrderOrdinal: Dispatch<SetStateAction<number>>;
  orderMenuHide: boolean;
  setOrderMenuHide: Dispatch<SetStateAction<boolean>>;
  skipCustomization: boolean;
  setSkipCustomization: Dispatch<SetStateAction<boolean>>;
  orderPriceDisplay: keyof typeof PriceDisplay;
  setOrderPriceDisplay: Dispatch<SetStateAction<keyof typeof PriceDisplay>>
  orderAdornment: string;
  setOrderAdornment: Dispatch<SetStateAction<string>>;
  orderSuppressExhaustiveModifierList: boolean;
  setOrderSuppressExhaustiveModifierList: Dispatch<SetStateAction<boolean>>;
}

const ProductInstanceComponent = ({
  parent_product,
  displayName,
  setDisplayName,
  description,
  setDescription,
  shortcode,
  setShortcode,
  ordinal,
  setOrdinal,
  revelID,
  setRevelID,
  squareID,
  setSquareID,
  modifiers,
  setModifiers,
  isBase,
  setIsBase,
  // menu
  menuOrdinal,
  setMenuOrdinal,
  menuHide,
  setMenuHide,
  menuPriceDisplay,
  setMenuPriceDisplay,
  menuAdornment,
  setMenuAdornment,
  menuSuppressExhaustiveModifierList,
  setMenuSuppressExhaustiveModifierList,
  menuShowModifierOptions,
  setMenuShowModifierOptions,
  // order
  orderOrdinal,
  setOrderOrdinal,
  orderMenuHide,
  setOrderMenuHide,
  skipCustomization,
  setSkipCustomization,
  orderPriceDisplay,
  setOrderPriceDisplay,
  orderAdornment,
  setOrderAdornment,
  orderSuppressExhaustiveModifierList,
  setOrderSuppressExhaustiveModifierList
}: ProductInstanceComponentProps) => {
  const modifier_types_map = useAppSelector(s => s.ws.catalog?.modifiers ?? {});
  const handleToggle = (mtid: number, oidx: number) => {
    const new_normalized_mod = modifiers.slice();
    new_normalized_mod[mtid].options = modifiers[mtid].options.slice();
    Object.assign(
      new_normalized_mod[mtid].options[oidx],
      modifiers[mtid].options[oidx]
    );

    switch (modifiers[mtid].options[oidx].placement) {
      case 'WHOLE':
        new_normalized_mod[mtid].options[oidx].placement = 'NONE';
        break;
      case 'NONE':
        new_normalized_mod[mtid].options[oidx].placement = 'WHOLE';
        new_normalized_mod[mtid].options[oidx].qualifier = 'REGULAR';
        break;
      default:
        console.error("messed up option value!");
    }
    setModifiers(new_normalized_mod);
  };

  const handleRadioChange = (mtidx: number, oidx: number) => {
    const new_normalized_mod = modifiers.slice();
    new_normalized_mod[mtidx].options = modifiers[mtidx].options.map(
      (opt, idx) =>
      // specifically using a == comparison since oidx is likely a string
      ({
        option_id: opt.option_id,
        // eslint-disable-next-line
        placement: idx == oidx ? 'WHOLE' : 'NONE',
        qualifier: 'REGULAR'
      })

    );
    setModifiers(new_normalized_mod);
  };

  const modifier_html = parent_product.modifiers.map((modifier_entry, mtidx) => {
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
          value={modifiers[mtidx].options.findIndex(
            (o) => o.placement === "WHOLE"
          )}
          onChange={(e) => handleRadioChange(mtidx, parseInt(e.target.value))}
        >
          {mt_options.map((option, oidx) => (
            <FormControlLabel
              key={oidx}
              control={<Radio disableRipple />}
              value={oidx}
              label={mt_options[oidx].item.display_name}
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
                    modifiers[mtidx].options[oidx].placement === "WHOLE"
                  }
                  onChange={() => handleToggle(mtidx, oidx)}
                  disableRipple
                  inputProps={{ "aria-labelledby": String(oidx) }}
                />
              }
              label={mt_options[oidx].item.display_name}
            />
          ))}
        </FormGroup>
      );
    }
    return (
      <Grid item xs={6} key={mtidx}>
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
          value={displayName}
          size="small"
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </Grid>
      <Grid item xs={8}>
        <TextField
          label="Description"
          type="text"
          fullWidth
          inputProps={{ size: 60 }}
          value={description}
          size="small"
          onChange={(e) => setDescription(e.target.value)}
        />
      </Grid>
      <Grid item xs={2}>
        <CheckedNumericInput
          type="number"
          label="Ordinal"
          inputProps={{ inputMode: 'numeric', min: 0, max: 99999, pattern: '[0-9]*', step: 1 }}
          value={ordinal}
          onChange={setOrdinal}
          parseFunction={parseInt}
          allowEmpty={false} />

      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Short Code"
          type="text"
          value={shortcode}
          inputProps={{ size: 40 }}
          size="small"
          onChange={(e) => setShortcode(e.target.value)}
        />
      </Grid>
      <Grid item xs={2}>
        <FormControlLabel
          control={
            <Switch
              sx={{ ml: 1 }}
              checked={isBase}
              onChange={(e) =>
                setIsBase(e.target.checked)
              }
              name="Is Base"
            />
          }
          label="Is Base"
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          label="Revel ID"
          type="text"
          value={revelID}
          inputProps={{ size: 50 }}
          size="small"
          onChange={(e) => setRevelID(e.target.value)}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          label="Square ID"
          type="text"
          value={squareID}
          inputProps={{ size: 50 }}
          size="small"
          onChange={(e) => setSquareID(e.target.value)}
        />
      </Grid>
      <Grid item xs={2}>
        <CheckedNumericInput
          type="number"
          label="Menu Ordinal"
          inputProps={{ inputMode: 'numeric', min: 0, max: 99999, pattern: '[0-9]*' }}
          value={menuOrdinal}
          onChange={setMenuOrdinal}
          parseFunction={parseInt}
          allowEmpty={false} />
      </Grid>
      <Grid item xs={3} alignItems="center">
        <FormControlLabel
          control={
            <Switch
              checked={menuHide}
              onChange={(e) =>
                setMenuHide(e.target.checked)
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
              checked={menuSuppressExhaustiveModifierList}
              onChange={(e) =>
                setMenuSuppressExhaustiveModifierList(e.target.checked)
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
              checked={menuShowModifierOptions}
              onChange={(e) =>
                setMenuShowModifierOptions(e.target.checked)
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
          value={menuAdornment}
          size="small"
          onChange={(e) => setMenuAdornment(e.target.value)}
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
            value={menuPriceDisplay}
            onChange={(e) => setMenuPriceDisplay(e.target.value as keyof typeof PriceDisplay)}
          >
            {Object.keys(PriceDisplay).map((val, i) =>
              <FormControlLabel
                key={i}
                value={val}
                control={<Radio />}
                label={val}
              />)}
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={2}>
        <CheckedNumericInput
          type="number"
          label="Order Ordinal"
          inputProps={{ inputMode: 'numeric', min: 0, max: 99999, pattern: '[0-9]*', step: 1 }}
          value={orderOrdinal}
          onChange={setOrderOrdinal}
          parseFunction={parseInt}
          allowEmpty={false} />
      </Grid>
      <Grid item xs={3}>
        <FormControlLabel
          control={
            <Switch
              checked={orderMenuHide}
              onChange={(e) =>
                setOrderMenuHide(e.target.checked)
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
              checked={orderSuppressExhaustiveModifierList}
              onChange={(e) =>
                setOrderSuppressExhaustiveModifierList(e.target.checked)
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
              checked={skipCustomization}
              onChange={(e) =>
                setSkipCustomization(e.target.checked)
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
          value={orderAdornment}
          size="small"
          onChange={(e) => setOrderAdornment(e.target.value)}
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
            value={orderPriceDisplay}
            onChange={(e) => setOrderPriceDisplay(e.target.value as keyof typeof PriceDisplay)}
          >
            {Object.keys(PriceDisplay).map((val, i) =>
              <FormControlLabel
                key={i}
                value={val}
                control={<Radio />}
                label={val}
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
  modifiers: IWModifiersInstance[]
) => {
  const normalized_modifiers: IWModifiersInstance[] = [];
  parent_product.modifiers.forEach((modifier_entry) => {
    const { mtid } = modifier_entry;
    const options: IWOptionInstance[] = modifier_types_map[mtid].options.map((option,) => ({
      option_id: option.id,
      placement: "NONE",
      qualifier: 'REGULAR'
    }));
    normalized_modifiers.push({ modifier_type_id: mtid, options });
  });
  // copy the selected modifiers over to the normalized
  modifiers.forEach((mod) => {
    const normalized_modifier = normalized_modifiers.find(
      (x) => x.modifier_type_id === mod.modifier_type_id
    );
    if (!isUndefined(normalized_modifier)) {
      mod.options.forEach((opt) => {
        if (opt.placement !== "NONE") {
          const found_modifier_option = normalized_modifier.options.find(
            (x) => x.option_id === opt.option_id
          );
          if (found_modifier_option) {
            Object.assign(found_modifier_option, opt);
          }
        }
      }
      );
    }
  });
  return normalized_modifiers;
};

const minimizeModifiers = (normalized_modifiers: IWModifiersInstance[]) =>
  normalized_modifiers.reduce((acc, mod) => {
    const filtered_options = mod.options.filter(
      (x) => x.placement !== "NONE"
    );
    return filtered_options.length ? [...acc, { modifier_type_id: mod.modifier_type_id, options: filtered_options }] : acc;
  }, []);


export const ProductInstanceContainer = ({ parent_product, modifiers, setModifiers, ...forwardRefs
}: ProductInstanceComponentProps) => {
  const modifier_types_map = useAppSelector(s => s.ws.catalog?.modifiers ?? {});
  const [normalizedModifers, setNormalizedModifiers] = useState<IWModifiersInstance[]>(
    normalizeModifiersAndOptions(parent_product, modifier_types_map, modifiers)
  );

  const setNormalizedModifiersIntermediate = (mods: IWModifiersInstance[]) => {
    setNormalizedModifiers(mods);
    setModifiers(minimizeModifiers(mods));
  };

  return (
    <ProductInstanceComponent
      parent_product={parent_product}
      modifiers={normalizedModifers}
      setModifiers={setNormalizedModifiersIntermediate}
      {...forwardRefs}
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
  ...forwardRefs
}: ProductInstanceActionContainerProps & ProductInstanceComponentProps) => (
  <ElementActionComponent
    onCloseCallback={onCloseCallback}
    onConfirmClick={onConfirmClick}
    isProcessing={isProcessing}
    disableConfirmOn={displayName.length === 0 || shortcode.length === 0 || isProcessing}
    confirmText={confirmText}
    body={
      <ProductInstanceContainer
        {...forwardRefs}
        displayName={displayName}
        shortcode={shortcode}
      />}
  />
)
