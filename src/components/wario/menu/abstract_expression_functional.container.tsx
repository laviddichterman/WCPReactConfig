import React, { Dispatch, SetStateAction, useMemo, useState, useEffect } from "react";

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
import { IAbstractExpression, IConstLiteralExpression, IHasAnyOfModifierExpression, IIfElseExpression, ILogicalExpression, IModifierPlacementExpression, IOption, ProductInstanceFunctionOperator, ProductInstanceFunctionType } from "@wcp/wcpshared";

// BUG// TODO: https://app.asana.com/0/1184794277483753/1200242818246330/f
// we need a way to disable saving the abstract expression if it's not fully specified
export interface AbstractExpressionFunctionalComponentProps {
  expression_types: Record<keyof typeof ProductInstanceFunctionType, React.ReactNode>;
  discriminator: ProductInstanceFunctionType | null;
  setDiscriminator: Dispatch<SetStateAction<ProductInstanceFunctionType | null>>;
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
                  onChange={(e) => setDiscriminator(ProductInstanceFunctionType[e.target.value as keyof typeof ProductInstanceFunctionType])}
                >
                  {Object.keys(ProductInstanceFunctionType).map((val, idx) => (
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
        { discriminator !== null && 
        <ListItem>
          <List>
            {expression_types[discriminator]}
          </List>
        </ListItem>
        }
      </List>
    </div>
  );

type ValSetVal<T> = { value: T, setValue: Dispatch<SetStateAction<T>> };
let ConstLiteralFunctionalComponent: ({ value, setValue }: ValSetVal<IConstLiteralExpression | null>) => JSX.Element;
let LogicalFunctionalComponent: ({ value, setValue }: ValSetVal<ILogicalExpression | null>) => JSX.Element;
let IfElseFunctionalComponent: ({ value, setValue }: ValSetVal<IIfElseExpression | null>) => JSX.Element;
let ModifierPlacementFunctionalComponent: ({ value, setValue }: ValSetVal<IModifierPlacementExpression|null>) => JSX.Element;
let HasAnyOfModifierTypeFunctionalComponent: ({ value, setValue }: ValSetVal<IHasAnyOfModifierExpression|null>) => JSX.Element;

const AbstractExpressionFunctionalContainer = ({
  value,
  setValue
} : ValSetVal<IAbstractExpression | null>) => {
  const [discriminator, setDiscriminator] = useState<ProductInstanceFunctionType | null>(value?.discriminator ?? null);
  const [expr, setExpr] = useState<IAbstractExpression['expr'] | null>(value?.expr ?? null);
  useEffect(()=>{
    if (discriminator !== null && expr !== null) { 
      setValue({ discriminator: discriminator, expr: expr } as IAbstractExpression);
    }
  }, [discriminator, expr]);
  const updateDiscriminator = (val: ProductInstanceFunctionType) => {
    setDiscriminator(val);
    setExpr(null);
  }
  const expression_types = {
    Logical: (
      <LogicalFunctionalComponent
        value={expr as ILogicalExpression}
        setValue={setExpr}
      />
    ),
    ConstLiteral: (
      <ConstLiteralFunctionalComponent
        value={expr as IConstLiteralExpression}
        setValue={setExpr}
      />
    ),
    IfElse: (
      <IfElseFunctionalComponent
        value={expr as IIfElseExpression}
        setValue={setExpr}
      />
    ),
    ModifierPlacement: (
      <ModifierPlacementFunctionalComponent 
        value={expr as IModifierPlacementExpression}
        setValue={setExpr}
      />
    ),
    HasAnyOfModifierType: (
      <HasAnyOfModifierTypeFunctionalComponent 
        value={expr as IHasAnyOfModifierExpression}
        setValue={setExpr}
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
  const [operator, setOperator] = useState(value?.operator ?? null);
  const [operandA, setOperandA] = useState(value?.operandA ?? null);
  const [operandB, setOperandB] = useState(value?.operandB ?? null);
  useEffect(() => {
    if (operator !== null && 
      operandA !== null && 
      (operator !== ProductInstanceFunctionOperator.NOT || operandB !== null)) {
      setValue({ operator, operandA, operandB: operandB ?? undefined });
    }
  }, [operator, operandA, operandB])
  const updateOperator = (val : string) => {
    const value = ProductInstanceFunctionOperator[val as keyof typeof ProductInstanceFunctionOperator];
    if ((operator === ProductInstanceFunctionOperator.NOT || value === ProductInstanceFunctionOperator.NOT) && operator !== value) {
      setOperandB(null);
    }
    setOperator(value);
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
                  value={operator}
                  onChange={(_, value) => updateOperator(value)}
                >
                  {Object.keys(ProductInstanceFunctionOperator).map((val, idx) => (
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
                value={operandA}
                setValue={setOperandA}
              />
            </CardContent>
          </Card>
        </ListItem>
      </List>
      {operator !== ProductInstanceFunctionOperator.NOT ? (
          <ListItem>
            <Card>
              <CardHeader title="Right Operand" />
              <CardContent>
                <AbstractExpressionFunctionalContainer
                  value={operandB}
                  setValue={setOperandB}
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
  const [testExpr, setTestExpr] = useState<IAbstractExpression | null>(value?.test ?? null);
  const [trueBranchExpr, setTrueBranchExpr] = useState<IAbstractExpression | null>(
    value?.true_branch ?? null
  );
  const [falseBranchExpr, setFalseBranchExpr] = useState<IAbstractExpression | null>(
    value?.false_branch ?? null
  );
  useEffect(() => {
    if (testExpr !== null && trueBranchExpr !== null && falseBranchExpr !== null) {
      setValue({test: testExpr, true_branch: trueBranchExpr, false_branch: falseBranchExpr});
    }
  }, [testExpr, trueBranchExpr, falseBranchExpr]);
  return (
    <div>
      <List>
        <ListItem>
          <Card>
            <CardHeader title="Test Expression" />
            <CardContent>
              <AbstractExpressionFunctionalContainer
                value={testExpr}
                setValue={setTestExpr}
              />
            </CardContent>
          </Card>
        </ListItem>
        <ListItem>
          <Card>
            <CardHeader title="True Branch Expression" />
            <CardContent>
              <AbstractExpressionFunctionalContainer
                value={trueBranchExpr}
                setValue={setTrueBranchExpr}
              />
            </CardContent>
          </Card>
        </ListItem>
        <ListItem>
          <Card>
            <CardHeader title="False Branch Expression" />
            <CardContent>
              <AbstractExpressionFunctionalContainer
                value={falseBranchExpr}
                setValue={setFalseBranchExpr}
              />
            </CardContent>
          </Card>
        </ListItem>
      </List>
    </div>
  );
};

HasAnyOfModifierTypeFunctionalComponent = ({
  value,
  setValue,
}) => {
  const modifier_types = useAppSelector(s=>s.ws.catalog?.modifiers ?? {});
  const [modifier, setModifier] = useState(value?.mtid ?? null);
  useEffect(() => {
    if (modifier !== null) {
      setValue({ mtid: modifier });
    }
  }, [modifier]);
  return (
    <Grid container>
      <Grid item>
        <Autocomplete
          style={{ width: 200 }}
          options={Object.keys(modifier_types)}
          value={modifier}
          onChange={(_, v) => setModifier(v)}
          getOptionLabel={(o) => modifier_types[o].modifier_type.name ?? "CORRUPTED DATA" }
          isOptionEqualToValue={(o, v) => o === v}
          renderInput={(params) => <TextField {...params} label="Modifier" />}
        />
      </Grid>
    </Grid>
  );
};


ModifierPlacementFunctionalComponent = ({
  value,
  setValue,
}) => {
  const modifier_types = useAppSelector(s=>s.ws.catalog?.modifiers ?? {});
  const [modifier, setModifier] = useState(value?.mtid ?? null);
  const modifierOptionsForType = useMemo(() => modifier !== null ? 
    modifier_types[modifier].options.reduce((acc : Record<string, IOption>, o) => ({...acc, [o.id]: o}), {}) : 
    {}, [modifier])
  const [modifierOption, setModifierOption] = useState(value?.moid ?? null);
  useEffect(() => {
    if (modifier !== null && modifierOption !== null) {
      setValue({ mtid: modifier, moid: modifierOption });
    }
  }, [modifier, modifierOption]);
  return (
    <Grid container>
      <Grid item>
        <Autocomplete
          style={{ width: 200 }}
          options={Object.keys(modifier_types)}
          value={modifier}
          onChange={(e, v) => setModifier(v)}
          getOptionLabel={(o) => modifier_types[o].modifier_type.name ?? "CORRUPTED DATA" }
          isOptionEqualToValue={(o, v) => o === v}
          renderInput={(params) => <TextField {...params} label="Modifier" />}
        />
      </Grid>

      {modifier !== null && modifier_types[modifier].options.length && (
        <Grid item xs={6}>
          <Autocomplete
            style={{ width: 200 }}
            options={Object.keys(modifierOptionsForType)}
            value={modifierOption}
            onChange={(_, v) => setModifierOption(v)}
            getOptionLabel={(o) => modifierOptionsForType[o].item.display_name ?? "CORRUPT DATA"}
            isOptionEqualToValue={(o, v) => o === v}
            renderInput={(params) => <TextField {...params} label="Option" />}
          />
        </Grid>
      )}
    </Grid>
  );
};

// todo: ADD PLACEMENT, BOOLEAN
const LITERAL_TYPES = {"Text": (x : string) => x, "Number": parseFloat };
ConstLiteralFunctionalComponent = ({ value, setValue }) => {
  // TODO FINISH getting the value in the correct type after changing the literalType flag
  const [literalType, setLiteralType] = useState(value !== null && typeof value.value !== 'number' ? "Text" : "Number");
  const [local_value, setLocalValue] = useState(value !== null ? String(value.value) : "");
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (local_value !== null) {
      setValue({ value: local_value });
    }
  }, [local_value]);
  const onFinishChangingLocal = () => {
    // @ts-ignore
    const new_val = typeof local_value === "string" && local_value.length ? LITERAL_TYPES[literalType](local_value) : local_value;
    setDirty(false);
    setLocalValue(new_val);
    setValue(new_val);
  }

  const onChangeLocal = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDirty(true);
    setLocalValue(e.target.value);
  }

  const updateLiteralType = (e: "Text" | 'Number') => {
    setLiteralType(e);
    // @ts-ignore
    setLocalValue(LITERAL_TYPES[e](local_value));
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
            onChange={(e) => updateLiteralType(e.target.value as "Text" | "Number")}
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
          value={dirty ? local_value : (value?.value ?? "")}
          size="small"
          fullWidth
          onChange={(e) => onChangeLocal(e)}
          onBlur={() => onFinishChangingLocal()}
        />
        </Grid>
      </Grid>
      </CardContent>
    </Card>
  );
};



export default AbstractExpressionFunctionalContainer;
