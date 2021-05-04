import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";

import CheckedInputComponent from "../checked_input.component";
import DatetimeBasedDisableComponent from "../datetime_based_disable.component";

// related to modifiers
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  title: {
    flexGrow: 1,
  },
  listLevel0: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  listLevel1: {
    paddingLeft: theme.spacing(4),
  },
}));

const ProductInstanceComponent = ({
  actions,
  progress,
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
  disabled,
  setDisabled,
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
  skipCustomization,
  setSkipCustomization,
  hideFromMenu,
  setHideFromMenu,
  menuAdornment,
  setMenuAdornment,
  priceDisplay,
  setPriceDisplay,
  suppressExhaustiveModifierList,
  setSuppressExhaustiveModifierList
}) => {
  const classes = useStyles();
  const actions_html =
    actions.length === 0 ? (
      ""
    ) : (
      <Grid container justify="flex-end" item xs={12}>
        {actions.map((action, idx) => (
          <Grid item key={idx}>
            {action}
          </Grid>
        ))}
      </Grid>
    );

  const handleToggle = (mtid, oidx) => {
    var newval = "NONE";
    switch (modifiers[mtid].options[oidx].placement) {
      case "WHOLE":
        newval = "NONE";
        break;
      case "NONE":
        newval = "WHOLE";
        break;
      default:
        alert("messed up option value!");
    }

    const new_normalized_mod = modifiers.slice();
    new_normalized_mod[mtid].options = modifiers[mtid].options.slice();
    Object.assign(
      new_normalized_mod[mtid].options[oidx],
      modifiers[mtid].options[oidx]
    );
    new_normalized_mod[mtid].options[oidx].placement = newval;
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
    <div className={classes.root}>
      <Grid container spacing={3} justify="center">
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
          <Grid item xs={4}>
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
              size="small"
              onChange={(e) => setShortcode(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
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
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={hideFromMenu}
                  onChange={(e) =>
                    setHideFromMenu(e.target.checked)
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
                  checked={suppressExhaustiveModifierList}
                  onChange={(e) =>
                    setSuppressExhaustiveModifierList(e.target.checked)
                  }
                  name="Suppress Exhaustive Modifier List"
                />
              }
              label="Suppress Exhaustive Modifier List"
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
              <FormLabel component="legend">Price Display</FormLabel>
              <RadioGroup
                defaultValue="ALWAYS"
                aria-label="price-display"
                name="price-display"
                row
                value={priceDisplay}
                onChange={(e) => setPriceDisplay(e.target.value)}
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
              </RadioGroup>
            </FormControl>
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
            <Grid item xs={12}>
            <DatetimeBasedDisableComponent
              disabled={disabled}
              setDisabled={setDisabled}
            />
          </Grid>

        {modifier_html}
        {actions_html}
        {progress}
      </Grid>
    </div>
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
        normalized_modifier.options.find(
          (x) => x.option_id === opt.option_id
        ).placement = opt.placement;
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
  actions,
  progress,
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
  disabled,
  setDisabled,
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
  skipCustomization,
  setSkipCustomization,
  hideFromMenu,
  setHideFromMenu,
  menuAdornment,
  setMenuAdornment,
  priceDisplay,
  setPriceDisplay,
  suppressExhaustiveModifierList,
  setSuppressExhaustiveModifierList
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
      actions={actions}
      progress={progress}
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
      disabled={disabled}
      setDisabled={setDisabled}
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
      skipCustomization={skipCustomization}
      setSkipCustomization={setSkipCustomization}
      hideFromMenu={hideFromMenu}
      setHideFromMenu={setHideFromMenu}
      menuAdornment={menuAdornment}
      setMenuAdornment={setMenuAdornment}
      priceDisplay={priceDisplay}
      setPriceDisplay={setPriceDisplay}
      suppressExhaustiveModifierList={suppressExhaustiveModifierList}
      setSuppressExhaustiveModifierList={setSuppressExhaustiveModifierList}
    />
  );
};

export default ProductInstanceContainer;
