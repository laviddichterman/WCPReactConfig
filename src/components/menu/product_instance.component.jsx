import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Switch from "@material-ui/core/Switch";

// related to modifiers
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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

const CheckForNumberGEZeroLT64Int = (e) => {
  const parsed = parseInt(e);
  return isNaN(parsed) || parsed < 0 || parsed > 63 ? 1 : parsed;
};


const ProductInstanceComponent = ({
  actions,
  progress,
  modifier_types_map,
  parent_product,
  displayName, setDisplayName,
  description, setDescription,
  shortcode, setShortcode,
  price, setPrice,
  enabled, setEnabled,
  revelID, setRevelID,
  squareID, setSquareID,
  modifiers, setModifiers
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
    Object.assign(new_normalized_mod[mtid].options[oidx], modifiers[mtid].options[oidx]);
    new_normalized_mod[mtid].options[oidx].placement = newval;
    setModifiers(new_normalized_mod);
  }

  const handleRadioChange = (mtidx, oidx) => {
    const new_normalized_mod = modifiers.slice();
    new_normalized_mod[mtidx].options = modifiers[mtidx].options.map((opt, idx) => {
      // specifically using a == comparison since oidx is likely a string
      return { option_id: opt.option_id, placement: idx == oidx ? "WHOLE" : "NONE" }
    });
    setModifiers(new_normalized_mod);
  }

  const modifier_html = parent_product.modifiers.map((mtid, mtidx) => {
    const mt = modifier_types_map[mtid].modifier_type;
    const mt_options = modifier_types_map[mtid].options;
    var mt_options_html;
    switch (mt.selection_type) {
      case "MANY": 
        mt_options_html = (<FormGroup row>
        {
          mt_options.map((option, oidx) => {
            return (
              <FormControlLabel 
                key={oidx}
                control={<Checkbox
                          checked={modifiers[mtidx].options[oidx].placement === "WHOLE"}
                          onChange={() => handleToggle(mtidx, oidx)}
                          disableRipple
                          inputProps={{ 'aria-labelledby': oidx }}
                        />} 
                label={mt_options[oidx].catalog_item.display_name} 
              />);  
            })
        }
        </FormGroup>);
      break;
      case "SINGLE":
        mt_options_html = (
        <RadioGroup 
          aria-label={mt._id} 
          name={mt.name} 
          row
          value={modifiers[mtidx].options.findIndex(o => o.placement === "WHOLE")}
          onChange={(e) => handleRadioChange(mtidx, e.target.value)}
        >
          {
            mt_options.map((option, oidx) => {
              return (
                <FormControlLabel 
                  key={oidx}
                  control={<Radio disableRipple />} 
                  value={oidx}
                  label={mt_options[oidx].catalog_item.display_name} 
                />);  
              })
          }
          </RadioGroup>);
          break;
      default:
        alert(`ERROR WITH MODIFIER TYPE SELECTION TYPE: ${JSON.stringify(mt)}`);
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
    )
  })

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justify="center">
        <Grid item xs={6}>
          <TextField
            label="Display Name"
            type="text"
            inputProps={{ size: 40 }}
            value={displayName}
            size="small"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Description"
            type="text"
            inputProps={{ size: 40 }}
            value={description}
            size="small"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Short Code"
            type="text"
            inputProps={{ size: 40 }}
            value={shortcode}
            size="small"
            onChange={(e) => setShortcode(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Price"
            type="text"
            inputProps={{ size: 10 }}
            value={price}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Switch checked={enabled} onChange={e => setEnabled(e.target.checked)} name="Enabled" />
            }
            label="Enabled"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Revel ID"
            type="text"
            inputProps={{ size: 20 }}
            value={revelID}
            size="small"
            onChange={(e) => setRevelID(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Square ID"
            type="text"
            inputProps={{ size: 20 }}
            value={squareID}
            size="small"
            onChange={(e) => setSquareID(e.target.value)}
          />
        </Grid>
        {modifier_html}
        {actions_html}
        {progress}
      </Grid>
    </div>
  );
};

const normalizeModifiersAndOptions = (parent_product, modifier_types_map, modifiers) => {
  var normalized_modifiers = [];
  parent_product.modifiers.forEach((mtid) => {
    const is_single = modifier_types_map[mtid].modifier_type.selection_type === "SINGLE";
    const options = modifier_types_map[mtid].options.map((option, idx) => {
      return {
        option_id: option._id,
        placement: "NONE"
      }
    })
    normalized_modifiers.push({modifier_type_id: mtid, options: options});
  });
  // copy the selected modifiers over to the normalized
  modifiers.forEach((mod) => {
    const normalized_modifier = normalized_modifiers.find(x => x.modifier_type_id === mod.modifier_type_id);
    mod.options.forEach((opt) => {
      if (opt.placement !== "NONE") {
        normalized_modifier.options.find(x => x.option_id === opt.option_id).placement = opt.placement;
      }
    });
  })
  return normalized_modifiers;
}

const minimizeModifiers = (normalized_modifiers) => {
  return normalized_modifiers.map((mod, idx) => {
    const filtered_options = mod.options.filter(x => x.placement !== "NONE");
    return filtered_options.length ? {modifier_type_id: mod.modifier_type_id, options: filtered_options} : null;
  }).filter(x => x != null)
}

const ProductInstanceContainer = ({ 
  actions,
  progress,
  modifier_types_map,
  parent_product,
  displayName, setDisplayName,
  description, setDescription,
  shortcode, setShortcode,
  price, setPrice,
  enabled, setEnabled,
  revelID, setRevelID,
  squareID, setSquareID,
  modifiers, setModifiers
}) => {
  const [normalizedModifers, setNormalizedModifiers] = useState(normalizeModifiersAndOptions(parent_product, modifier_types_map, modifiers));

  const setNormalizedModifiersIntermediate = (mods) => {
    setNormalizedModifiers(mods);
    setModifiers(minimizeModifiers(mods));
  }

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
      enabled={enabled}
      setEnabled={setEnabled}
      revelID={revelID}
      setRevelID={setRevelID}
      squareID={squareID}
      setSquareID={setSquareID}
      modifiers={normalizedModifers}
      setModifiers={setNormalizedModifiersIntermediate}
    />
  );
};


export default ProductInstanceContainer;
