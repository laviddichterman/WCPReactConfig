/* eslint-disable prefer-const */
import React, { Dispatch, SetStateAction, useState } from "react";

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
import { useAppSelector } from "src/hooks/useRedux";
import { IAbstractExpression, IHasAnyOfModifierExpression, IModifierPlacementExpression, ProductInstanceFunctionType } from "@wcp/wcpshared";

// BUG// TODO: https://app.asana.com/0/1184794277483753/1200242818246330/f
// we need a way to disable saving the abstract expression if it's not fully specified
export interface AbstractExpressionFunctionalComponentProps {
  expression_types: Record<keyof typeof ProductInstanceFunctionType, React.ReactNode>;
  discriminator: keyof typeof ProductInstanceFunctionType;
  setDiscriminator: Dispatch<SetStateAction<keyof typeof ProductInstanceFunctionType>>;
}

const AbstractExpressionFunctionalComponent = ({
  expression_types,
  discriminator,
  setDiscriminator,
} : AbstractExpressionFunctionalComponentProps) => (
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
                  onChange={(e) => setDiscriminator(e.target.value as keyof typeof ProductInstanceFunctionType)}
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

let ConstLiteralFunctionalComponent: (props: any) => JSX.Element;
let LogicalFunctionalComponent: (props: any) => JSX.Element;
let IfElseFunctionalComponent: (props: any) => JSX.Element;
let ModifierPlacementFunctionalComponent: (props: any) => JSX.Element;
let HasAnyOfModifierTypeFunctionalComponent: (props: any) => JSX.Element;

// convert this to a ListItem that can be collapsed and returns a text representation of the internal expression when collapsed
export interface AbstractExpressionFunctionalContainerProps {
  expression: IAbstractExpression | null;
  setExpression: Dispatch<SetStateAction<IAbstractExpression | null>>;
}
const AbstractExpressionFunctionalContainer = ({
  expression,
  setExpression,
} : AbstractExpressionFunctionalContainerProps) => {

  const modifier_types = useAppSelector(s=>s.ws.catalog?.modifiers ?? {});
  const [discriminator, setDiscriminator] = useState<keyof typeof ProductInstanceFunctionType>(expression?.discriminator ?? 'ConstLiteral');
  const [constLiteralValue, setConstLiteralValue] = useState<number | string>(expression && expression.discriminator && expression.discriminator === "ConstLiteral" && expression.const_literal ? expression.const_literal.value : "" );
  const [logicalValue, setLogicalValue] = useState(expression && expression.discriminator && expression.discriminator === "Logical" && expression.logical ? expression.logical : { operator: "AND" } );
  const [ifElseValue, setIfElseValue] = useState(expression && expression.discriminator && expression.discriminator === "IfElse" && expression.if_else ? expression.if_else : {} );
  const [modifierPlacementValue, setModifierPlacementValue] = useState(expression && expression.discriminator && expression.discriminator === "ModifierPlacement" && expression.modifier_placement ? expression.modifier_placement : {} );
  const [hasAnyOfModifierTypeValue, setHasAnyOfModifierTypeValue] = useState(expression && expression.discriminator && expression.discriminator === "HasAnyOfModifierType" && expression.has_any_of_modifier ? expression.has_any_of_modifier : {} );
  const updateDiscriminator = (val: keyof typeof ProductInstanceFunctionType) => {
    setDiscriminator(val);
    setExpression({...expression, discriminator: val});
  }
  const updateConstLiteralValue = (val: number | string) => {
    setConstLiteralValue(val);
    setExpression({...expression, const_literal: { value: val } });
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
  value,
  setValue,
}) => {
  const [testExpr, setTestExpr] = useState<IAbstractExpression>(value?.test ?? {});
  const [trueBranchExpr, setTrueBranchExpr] = useState<IAbstractExpression>(
    value?.true_branch ?? {}
  );
  const [falseBranchExpr, setFalseBranchExpr] = useState<IAbstractExpression>(
    value?.false_branch ?? {}
  );
  const updateTestExpr = (val) => {
    setTestExpr(val);
    const newValue = {};
    Object.assign(newValue, value);
    newValue.test = val;
    setValue(newValue);
  };
  const updateTrueBranchExpr = (val: IAbstractExpression) => {
    setTrueBranchExpr(val);
    setValue({...value, true_branch: val });
  };
  const updateFalseBranchExpr = (val: IAbstractExpression) => {
    setFalseBranchExpr(val);
    setValue({...value, false_branch: val });
  };
  return (
    <div>
      <List>
        <ListItem>
          <Card>
            <CardHeader title="Test Expression" />
            <CardContent>
              <AbstractExpressionFunctionalContainer
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
export interface HasAnyOfModifierTypeFunctionalComponentProps { 
  value: IHasAnyOfModifierExpression;
  setValue: Dispatch<SetStateAction<IHasAnyOfModifierExpression>>;
}
HasAnyOfModifierTypeFunctionalComponent = ({
  value,
  setValue,
} : HasAnyOfModifierTypeFunctionalComponentProps) => {
  const modifier_types = useAppSelector(s=>s.ws.catalog?.modifiers ?? {});
  const [modifier, setModifier] = useState(value && value.mtid ? modifier_types[value.mtid] : null);
  const updateModifier = (val) => {
    setModifier(val);
    setValue(val ? { mtid: val.modifier_type.id } : {});
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
            option.modifier_type.id === value.modifier_type.id
          }
          renderInput={(params) => <TextField {...params} label="Modifier" />}
        />
      </Grid>
    </Grid>
  );
};

export interface ModifierPlacementFunctionalComponentProps {
  value: IModifierPlacementExpression;
  setValue: Dispatch<SetStateAction<IModifierPlacementExpression>>;
 }
ModifierPlacementFunctionalComponent = ({
  value,
  setValue,
}: ModifierPlacementFunctionalComponentProps) => {
  const modifier_types = useAppSelector(s=>s.ws.catalog?.modifiers ?? {});
  const [modifier, setModifier] = useState(value && value.mtid ? modifier_types[value.mtid] : null);
  const [modifierOption, setModifierOption] = useState(value && value.moid ? modifier_types[value.mtid].options.find(x => x.id === value.moid) : null);
  const updateModifier = (val) => {
    setModifier(val);
    setValue({});
  };
  const updateModifierOption = (val) => {
    setModifierOption(val);
    setValue(val ? { mtid: val.option_type_id, moid: val.id} : {});
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
            option.modifier_type.id === value.modifier_type.id
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
              option && value && option.id === value.id
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
