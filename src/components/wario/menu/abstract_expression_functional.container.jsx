/* eslint-disable prefer-const */
import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Autocomplete from '@mui/material/Autocomplete';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

// BUG// TODO: https://app.asana.com/0/1184794277483753/1200242818246330/f
// we need a way to disable saving the abstract expression if it's not fully specified

const AbstractExpressionFunctionalComponent = ({
  expression_types,
  discriminator,
  setDiscriminator,
}) => (
    <div>
      <List>
        <ListItem>
          <Card>
            <CardContent>
              <FormControl component="fieldset">
                <FormLabel>Expression Type</FormLabel>
                <RadioGroup
                  aria-label="Expression Type"
                  name="Expression Type"
                  row
                  value={discriminator}
                  onChange={(e) => setDiscriminator(e.target.value)}
                >
                  {Object.keys(expression_types).map((val, idx) => (
                      <FormControlLabel
                        key={idx}
                        control={<Radio disableRipple />}
                        value={val}
                        label={val}
                      />
                    ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </ListItem>
        <ListItem>
          <List>
            {expression_types[discriminator]}
          </List>
        </ListItem>
      </List>
    </div>
  );

let ConstLiteralFunctionalComponent;
let LogicalFunctionalComponent;
let IfElseFunctionalComponent;
let ModifierPlacementFunctionalComponent;
let HasAnyOfModifierTypeFunctionalComponent;

// convert this to a ListItem that can be collapsed and returns a text representation of the internal expression when collapsed
const AbstractExpressionFunctionalContainer = ({
  modifier_types,
  expression,
  setExpression,
}) => {
  const [discriminator, setDiscriminator] = useState(expression?.discriminator ?? "");
  const [constLiteralValue, setConstLiteralValue] = useState(expression && expression.discriminator && expression.discriminator === "ConstLiteral" && expression.const_literal ? expression.const_literal.value : "" );
  const [logicalValue, setLogicalValue] = useState(expression && expression.discriminator && expression.discriminator === "Logical" && expression.logical ? expression.logical : { operator: "AND" } );
  const [ifElseValue, setIfElseValue] = useState(expression && expression.discriminator && expression.discriminator === "IfElse" && expression.if_else ? expression.if_else : {} );
  const [modifierPlacementValue, setModifierPlacementValue] = useState(expression && expression.discriminator && expression.discriminator === "ModifierPlacement" && expression.modifier_placement ? expression.modifier_placement : {} );
  const [hasAnyOfModifierTypeValue, setHasAnyOfModifierTypeValue] = useState(expression && expression.discriminator && expression.discriminator === "HasAnyOfModifierType" && expression.has_any_of_modifier ? expression.has_any_of_modifier : {} );
  const updateDiscriminator = (val) => {
    setDiscriminator(val);
    const newexpr = {};
    Object.assign(newexpr, expression);
    newexpr.discriminator = val;
    setExpression(newexpr);
  }
  const updateConstLiteralValue = (val) => {
    setConstLiteralValue(val);
    const newexpr = {};
    Object.assign(newexpr, expression);
    newexpr.const_literal = { value: val };
    setExpression(newexpr);
  };
  const updateLogicalValue = (val) => {
    setLogicalValue(val);
    const newexpr = { discriminator: expression.discriminator, logical: val };
    setExpression(newexpr);
  };
  const updateModifierPlacementValue = (val) => {
    setModifierPlacementValue(val);
    const newexpr = { discriminator: expression.discriminator, modifier_placement: val };
    setExpression(newexpr);
  };
  const updateHasAnyOfModifierTypeValue = (val) => {
    setHasAnyOfModifierTypeValue(val);
    console.log(val);
    const newexpr = { discriminator: expression.discriminator, has_any_of_modifier: val };
    console.log(newexpr);
    setExpression(newexpr);
  };
  const updateIfElseValue = (val) => {
    setIfElseValue(val);
    const newexpr = { discriminator: expression.discriminator, if_else: val };
    setExpression(newexpr);
  };
  const expression_types = {
    Logical: (
      <LogicalFunctionalComponent
        modifier_types={modifier_types}
        value={logicalValue}
        setValue={updateLogicalValue}
      />
    ),
    ConstLiteral: (
      <ConstLiteralFunctionalComponent
        value={constLiteralValue}
        setValue={updateConstLiteralValue}
      />
    ),
    IfElse: (
      <IfElseFunctionalComponent
        modifier_types={modifier_types}
        value={ifElseValue}
        setValue={updateIfElseValue}
      />
    ),
    ModifierPlacement: (
      <ModifierPlacementFunctionalComponent 
        modifier_types={modifier_types} 
        value={modifierPlacementValue}
        setValue={updateModifierPlacementValue}
      />
    ),
    HasAnyOfModifierType: (
      <HasAnyOfModifierTypeFunctionalComponent 
        modifier_types={modifier_types} 
        value={hasAnyOfModifierTypeValue}
        setValue={updateHasAnyOfModifierTypeValue}
      />
    ),
  };
  return (
    <AbstractExpressionFunctionalComponent
      expression_types={expression_types}
      discriminator={discriminator}
      setDiscriminator={updateDiscriminator}
    />
  );
};


const operators = ["AND", "OR", "NOT", "EQ", "NE", "GT", "GE", "LT", "LE"];
LogicalFunctionalComponent = ({
  modifier_types,
  value,
  setValue,
}) => {
  const [operator, setOperator] = useState(value?.operator ?? "AND");
  const [operandA, setOperandA] = useState(value?.operandA ?? {});
  const [operandB, setOperandB] = useState(value?.operandB ?? {});
  const updateOperator = (val) => {
    setOperator(val);
    const newValue = {};
    Object.assign(newValue, value);
    newValue.operator = val;
    setValue(newValue);
  };
  const updateOperandA = (val) => {
    setOperandA(val);
    const newValue = {};
    Object.assign(newValue, value);
    newValue.operandA = val;
    setValue(newValue);
  };
  const updateOperandB = (val) => {
    setOperandB(val);
    const newValue = {};
    Object.assign(newValue, value);
    newValue.operandB = val;
    setValue(newValue);
  };
  return (
    <div>
      <List>
        <ListItem>
          <Card>
            <CardContent>
              <FormControl component="fieldset">
                <FormLabel>Operator</FormLabel>
                <RadioGroup
                  aria-label="Operator"
                  name="Operator"
                  row
                  defaultValue={operators[0]}
                  value={operator}
                  onChange={(e) => updateOperator(e.target.value)}
                >
                  {operators.map((val, idx) => (
                      <FormControlLabel
                        key={idx}
                        control={<Radio disableRipple />}
                        value={val}
                        label={val}
                      />
                    ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </ListItem>
        <ListItem>
          <Card>
            <CardHeader title="Left Operand" />
            <CardContent>
              <AbstractExpressionFunctionalContainer
                modifier_types={modifier_types}
                expression={operandA}
                setExpression={updateOperandA}
              />
            </CardContent>
          </Card>
        </ListItem>
      </List>
      {operator !== "NOT" ? (
          <ListItem>
            <Card>
              <CardHeader title="Right Operand" />
              <CardContent>
                <AbstractExpressionFunctionalContainer
                  modifier_types={modifier_types}
                  expression={operandB}
                  setExpression={updateOperandB}
                />
              </CardContent>
            </Card>
          </ListItem>
        ) : (
          ""
        )}
    </div>
  );
};

IfElseFunctionalComponent = ({
  modifier_types,
  value,
  setValue,
}) => {
  const [testExpr, setTestExpr] = useState(value?.test ?? {});
  const [trueBranchExpr, setTrueBranchExpr] = useState(
    value?.true_branch ?? {}
  );
  const [falseBranchExpr, setFalseBranchExpr] = useState(
    value?.false_branch ?? {}
  );
  const updateTestExpr = (val) => {
    setTestExpr(val);
    const newValue = {};
    Object.assign(newValue, value);
    newValue.test = val;
    setValue(newValue);
  };
  const updateTrueBranchExpr = (val) => {
    setTrueBranchExpr(val);
    const newValue = {};
    Object.assign(newValue, value);
    newValue.true_branch = val;
    setValue(newValue);
  };
  const updateFalseBranchExpr = (val) => {
    setFalseBranchExpr(val);
    const newValue = {};
    Object.assign(newValue, value);
    newValue.false_branch = val;
    setValue(newValue);
  };
  return (
    <div>
      <List>
        <ListItem>
          <Card>
            <CardHeader title="Test Expression" />
            <CardContent>
              <AbstractExpressionFunctionalContainer
                modifier_types={modifier_types}
                expression={testExpr}
                setExpression={updateTestExpr}
              />
            </CardContent>
          </Card>
        </ListItem>
        <ListItem>
          <Card>
            <CardHeader title="True Branch Expression" />
            <CardContent>
              <AbstractExpressionFunctionalContainer
                modifier_types={modifier_types}
                expression={trueBranchExpr}
                setExpression={updateTrueBranchExpr}
              />
            </CardContent>
          </Card>
        </ListItem>
        <ListItem>
          <Card>
            <CardHeader title="False Branch Expression" />
            <CardContent>
              <AbstractExpressionFunctionalContainer
                modifier_types={modifier_types}
                expression={falseBranchExpr}
                setExpression={updateFalseBranchExpr}
              />
            </CardContent>
          </Card>
        </ListItem>
      </List>
    </div>
  );
};

HasAnyOfModifierTypeFunctionalComponent = ({
  modifier_types,
  value,
  setValue,
}) => {
  const [modifier, setModifier] = useState(value && value.mtid ? modifier_types[value.mtid] : null);
  const updateModifier = (val) => {
    setModifier(val);
    setValue(val ? { mtid: val.modifier_type._id } : {});
  };
  return (
    <Grid container>
      <Grid item>
        <Autocomplete
          style={{ width: 200 }}

          options={Object.values(modifier_types)}
          value={modifier}
          onChange={(e, v) => updateModifier(v)}
          getOptionLabel={(option) =>
            option?.modifier_type.name ?? "CORRUPT DATA"
          }
          isOptionEqualToValue={(option, value) =>
            option &&
            value &&
            option.modifier_type._id === value.modifier_type._id
          }
          renderInput={(params) => <TextField {...params} label="Modifier" />}
        />
      </Grid>
    </Grid>
  );
};


ModifierPlacementFunctionalComponent = ({
  modifier_types,
  value,
  setValue,
}) => {
  const [modifier, setModifier] = useState(value && value.mtid ? modifier_types[value.mtid] : null);
  const [modifierOption, setModifierOption] = useState(value && value.moid ? modifier_types[value.mtid].options.find(x => x._id === value.moid) : null);
  const updateModifier = (val) => {
    setModifier(val);
    setValue({});
  };
  const updateModifierOption = (val) => {
    setModifierOption(val);
    setValue(val ? { mtid: val.option_type_id, moid: val._id} : {});
  };
  return (
    <Grid container>
      <Grid item>
        <Autocomplete
          style={{ width: 200 }}

          options={Object.values(modifier_types)}
          value={modifier}
          onChange={(e, v) => updateModifier(v)}
          getOptionLabel={(option) =>
            option?.modifier_type.name ?? "CORRUPT DATA"
          }
          isOptionEqualToValue={(option, value) =>
            option &&
            value &&
            option.modifier_type._id === value.modifier_type._id
          }
          renderInput={(params) => <TextField {...params} label="Modifier" />}
        />
      </Grid>

      {modifier && modifier.options.length ? (
        <Grid item xs={6}>
          <Autocomplete
            style={{ width: 200 }}

            options={modifier ? modifier.options : []}
            value={modifierOption}
            onChange={(e, v) => updateModifierOption(v)}
            getOptionLabel={(option) =>
              option?.item.display_name ?? "CORRUPT DATA"
            }
            isOptionEqualToValue={(option, value) =>
              option && value && option._id === value._id
            }
            renderInput={(params) => <TextField {...params} label="Option" />}
          />
        </Grid>
      ) : (
        ""
      )}
    </Grid>
  );
};

// todo: ADD PLACEMENT, BOOLEAN
const LITERAL_TYPES = {"Text": (x) => x, "Number": parseFloat };
ConstLiteralFunctionalComponent = ({ value, setValue }) => {
  // TODO FINISH getting the value in the correct type after changing the literalType flag
  const [literalType, setLiteralType] = useState(value && typeof value !== 'number' ? "Text" : "Number");
  const [local_value, setLocalValue] = useState(value);
  const [dirty, setDirty] = useState(false);
  const onFinishChangingLocal = () => {
    const new_val = typeof local_value === "string" && local_value.length ? LITERAL_TYPES[literalType](local_value) : local_value;
    setDirty(false);
    setLocalValue(new_val);
    setValue(new_val);
  }

  const onChangeLocal = (e) => {
    setDirty(true);
    setLocalValue(e.target.value);
  }

  const updateLiteralType = (e) => {
    setLiteralType(e);
    setLocalValue(local_value.length ? LITERAL_TYPES[e](local_value) : "");
    onFinishChangingLocal();
  }
  return (
    <Card>
      <CardContent>
        <Grid container>
        <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel>Literal Type</FormLabel>
          <RadioGroup
            aria-label="Literal Type"
            name="Literal Type"
            row
            value={literalType}
            onChange={(e) => updateLiteralType(e.target.value)}
          >
            {Object.keys(LITERAL_TYPES).map((val, idx) => (
                <FormControlLabel
                  key={idx}
                  control={<Radio disableRipple />}
                  value={val}
                  label={val}
                />
              ))}
          </RadioGroup>
        </FormControl>
        </Grid>
        <Grid item xs={12}>
        <TextField
          label="Literal Value"
          type={literalType === "Text" ? "text" : "number"}
          value={dirty ? local_value : value}
          size="small"
          fullWidth
          onChange={onChangeLocal}
          onBlur={onFinishChangingLocal}
        />
        </Grid>
      </Grid>
      </CardContent>
    </Card>
  );
};



export default AbstractExpressionFunctionalContainer;
