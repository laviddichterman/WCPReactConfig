import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";

import CheckedInputComponent from "../checked_input.component";
import { ElementActionComponent } from "./element.action.component";

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

const ProductInstanceComponent = ({
  confirmText,
  onCloseCallback,
  onConfirmClick,
  isProcessing,
  modifier_types_map,
  parent_product,
  displayName,
  setDisplayName,
  description,
  setDescription,
  shortcode,
  setShortcode,
  price,
  setPrice,
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
}) => {
  const handleToggle = (mtid, oidx) => {
    const new_normalized_mod = modifiers.slice();
    new_normalized_mod[mtid].options = modifiers[mtid].options.slice();
    Object.assign(
      new_normalized_mod[mtid].options[oidx],
      modifiers[mtid].options[oidx]
    );

    switch (modifiers[mtid].options[oidx].placement) {
      case "WHOLE":
        new_normalized_mod[mtid].options[oidx].placement = "NONE";
        break;
      case "NONE":
        new_normalized_mod[mtid].options[oidx].placement = "WHOLE";
        new_normalized_mod[mtid].options[oidx].qualifier = "REGULAR";
        break;
      default:
        alert("messed up option value!");
    }
    setModifiers(new_normalized_mod);
  };

  const handleRadioChange = (mtidx, oidx) => {
    const new_normalized_mod = modifiers.slice();
    new_normalized_mod[mtidx].options = modifiers[mtidx].options.map(
      (opt, idx) => {
        // specifically using a == comparison since oidx is likely a string
        return {
          option_id: opt.option_id,
          // eslint-disable-next-line
          placement: idx == oidx ? "WHOLE" : "NONE",
          qualifier: "REGULAR"
        };
      }
    );
    setModifiers(new_normalized_mod);
  };

  const modifier_html = parent_product.modifiers.map((modifier_entry, mtidx) => {
    const mtid = modifier_entry.mtid;
    const mt = modifier_types_map[mtid].modifier_type;
    const mt_options = modifier_types_map[mtid].options;
    var mt_options_html;
    if (mt.min_selected === 1 && mt.max_selected === 1) {
      mt_options_html = (
        <RadioGroup
          aria-label={mt._id}
          name={mt.name}
          row
          value={modifiers[mtidx].options.findIndex(
            (o) => o.placement === "WHOLE"
          )}
          onChange={(e) => handleRadioChange(mtidx, e.target.value)}
        >
          {mt_options.map((option, oidx) => {
            return (
              <FormControlLabel
                key={oidx}
                control={<Radio disableRipple />}
                value={oidx}
                label={mt_options[oidx].item.display_name}
              />
            );
          })}
        </RadioGroup>
      );
    } else {
      mt_options_html = (
        <FormGroup row>
          {mt_options.map((option, oidx) => {
            return (
              <FormControlLabel
                key={oidx}
                control={
                  <Checkbox
                    checked={
                      modifiers[mtidx].options[oidx].placement === "WHOLE"
                    }
                    onChange={() => handleToggle(mtidx, oidx)}
                    disableRipple
                    inputProps={{ "aria-labelledby": oidx }}
                  />
                }
                label={mt_options[oidx].item.display_name}
              />
            );
          })}
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
    <ElementActionComponent 
      onCloseCallback={onCloseCallback}
      onConfirmClick={onConfirmClick}
      isProcessing={isProcessing}
      disableConfirmOn={displayName.length === 0 || shortcode.length === 0 || price < 0 || isProcessing}
      confirmText={confirmText}
      body={
        <>
          <Grid item xs={6}>
            <TextField
              label="Display Name"
              type="text"
              inputProps={{ size: 60 }}
              value={displayName}
              size="small"
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
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
              <CheckedInputComponent
                label="Ordinal"
                type="number"
                value={ordinal}
                inputProps={{ min: 0 }}
                onFinishChanging={(e) => setOrdinal(e)}
              />
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
            <Grid item xs={3}>
              <CheckedInputComponent
                label="Price"
                className="form-control"
                type="number"
                parseFunction={(e) => parseFloat(e).toFixed(2)}
                value={price}
                inputProps={{ min: 0, size: 40 }}
                onFinishChanging={(e) => setPrice(e)}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Switch
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
            <Grid item xs={6}>
              <TextField
                label="Revel ID"
                type="text"
                value={revelID}
                inputProps={{ size: 50 }}
                size="small"
                onChange={(e) => setRevelID(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Square ID"
                type="text"
                value={squareID}
                inputProps={{ size: 50 }}
                size="small"
                onChange={(e) => setSquareID(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <CheckedInputComponent
                label="Menu Ordinal"
                type="number"
                value={menuOrdinal}
                inputProps={{ min: 0 }}
                onFinishChanging={(e) => setMenuOrdinal(e)}
              />
            </Grid>
            <Grid item xs={3}>
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
            <Grid item xs={3}>
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
                  defaultValue="ALWAYS"
                  aria-label="menu-price-display"
                  name="menu-price-display"
                  row
                  value={menuPriceDisplay}
                  onChange={(e) => setMenuPriceDisplay(e.target.value)}
                >
                  <FormControlLabel
                    value="FROM_X"
                    control={<Radio />}
                    label="From X"
                  />
                  <FormControlLabel
                    value="VARIES"
                    control={<Radio />}
                    label="Never"
                  />
                  <FormControlLabel
                    value="ALWAYS"
                    control={<Radio />}
                    label="Always"
                  />
                  <FormControlLabel
                    value="MIN_TO_MAX"
                    control={<Radio />}
                    label="Min To Max"
                  />      
                  <FormControlLabel
                    value="LIST"
                    control={<Radio />}
                    label="List"
                  />                          
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <CheckedInputComponent
                label="Order Ordinal"
                type="number"
                value={orderOrdinal}
                inputProps={{ min: 0 }}
                onFinishChanging={(e) => setOrderOrdinal(e)}
              />
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
            <Grid item xs={3}>
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
                  onChange={(e) => setOrderPriceDisplay(e.target.value)}
                >
                  <FormControlLabel
                    value="FROM_X"
                    control={<Radio />}
                    label="From X"
                  />
                  <FormControlLabel
                    value="VARIES"
                    control={<Radio />}
                    label="Never"
                  />
                  <FormControlLabel
                    value="ALWAYS"
                    control={<Radio />}
                    label="Always"
                  />
                  <FormControlLabel
                    value="MIN_TO_MAX"
                    control={<Radio />}
                    label="Min To Max"
                  />      
                  <FormControlLabel
                    value="LIST"
                    control={<Radio />}
                    label="List"
                  />                          
                </RadioGroup>
              </FormControl>
            </Grid>
          {modifier_html}
        </>}
    />
  );
};

const normalizeModifiersAndOptions = (
  parent_product,
  modifier_types_map,
  modifiers
) => {
  var normalized_modifiers = [];
  parent_product.modifiers.forEach((modifier_entry) => {
    const mtid = modifier_entry.mtid;
    const options = modifier_types_map[mtid].options.map((option, idx) => {
      return {
        option_id: option._id,
        placement: "NONE",
      };
    });
    normalized_modifiers.push({ modifier_type_id: mtid, options: options });
  });
  // copy the selected modifiers over to the normalized
  modifiers.forEach((mod) => {
    const normalized_modifier = normalized_modifiers.find(
      (x) => x.modifier_type_id === mod.modifier_type_id
    );
    mod.options.forEach((opt) => {
      if (opt.placement !== "NONE") {
        const found_modifier_option = normalized_modifier.options.find(
          (x) => x.option_id === opt.option_id
        );
        found_modifier_option.placement = opt.placement;
        found_modifier_option.qualifier = opt.qualifier;
      }
    });
  });
  return normalized_modifiers;
};

const minimizeModifiers = (normalized_modifiers) => {
  return normalized_modifiers
    .map((mod, idx) => {
      const filtered_options = mod.options.filter(
        (x) => x.placement !== "NONE"
      );
      return filtered_options.length
        ? { modifier_type_id: mod.modifier_type_id, options: filtered_options }
        : null;
    })
    .filter((x) => x != null);
};

const ProductInstanceContainer = ({
  confirmText,
  onCloseCallback,
  onConfirmClick,
  isProcessing,
  modifier_types_map,
  parent_product,
  displayName,
  setDisplayName,
  description,
  setDescription,
  shortcode,
  setShortcode,
  price,
  setPrice,
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
}) => {
  const [normalizedModifers, setNormalizedModifiers] = useState(
    normalizeModifiersAndOptions(parent_product, modifier_types_map, modifiers)
  );

  const setNormalizedModifiersIntermediate = (mods) => {
    setNormalizedModifiers(mods);
    setModifiers(minimizeModifiers(mods));
  };

  return (
    <ProductInstanceComponent
      confirmText={confirmText}
      onCloseCallback={onCloseCallback}
      onConfirmClick={onConfirmClick}
      isProcessing={isProcessing}
      modifier_types_map={modifier_types_map}
      parent_product={parent_product}
      displayName={displayName}
      setDisplayName={setDisplayName}
      description={description}
      setDescription={setDescription}
      shortcode={shortcode}
      setShortcode={setShortcode}
      price={price}
      setPrice={setPrice}
      ordinal={ordinal}
      setOrdinal={setOrdinal}
      revelID={revelID}
      setRevelID={setRevelID}
      squareID={squareID}
      setSquareID={setSquareID}
      modifiers={normalizedModifers}
      setModifiers={setNormalizedModifiersIntermediate}
      isBase={isBase}
      setIsBase={setIsBase}
      // menu
      menuOrdinal={menuOrdinal}
      setMenuOrdinal={setMenuOrdinal}
      menuHide={menuHide}
      setMenuHide={setMenuHide}
      menuPriceDisplay={menuPriceDisplay}
      setMenuPriceDisplay={setMenuPriceDisplay}
      menuAdornment={menuAdornment}
      setMenuAdornment={setMenuAdornment}
      menuSuppressExhaustiveModifierList={menuSuppressExhaustiveModifierList}
      setMenuSuppressExhaustiveModifierList={setMenuSuppressExhaustiveModifierList}
      menuShowModifierOptions={menuShowModifierOptions}
      setMenuShowModifierOptions={setMenuShowModifierOptions}
      // order
      orderOrdinal={orderOrdinal}
      setOrderOrdinal={setOrderOrdinal}
      orderMenuHide={orderMenuHide}
      setOrderMenuHide={setOrderMenuHide}
      skipCustomization={skipCustomization}
      setSkipCustomization={setSkipCustomization}
      orderPriceDisplay={orderPriceDisplay}
      setOrderPriceDisplay={setOrderPriceDisplay}
      orderAdornment={orderAdornment}
      setOrderAdornment={setOrderAdornment}
      orderSuppressExhaustiveModifierList={orderSuppressExhaustiveModifierList}
      setOrderSuppressExhaustiveModifierList={setOrderSuppressExhaustiveModifierList}
    />
  );
};

export default ProductInstanceContainer;
