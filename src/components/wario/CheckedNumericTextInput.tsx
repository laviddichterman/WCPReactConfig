import React, { useCallback, useState } from 'react';
import { InputBaseComponentProps, TextField, TextFieldProps } from '@mui/material';

// TODO: centralize this in a shared react repo

type MinMax = { min: number; max: number; } | { min: number } | { max: number };
type ChkFxnAllowEmptyFalse = { inputProps: MinMax & InputBaseComponentProps } & { parseFunction: (v: string | null) => number; allowEmpty: false; };
type ChkFxnAllowEmptyTrue = { inputProps: Partial<MinMax> & InputBaseComponentProps } & { parseFunction: (v: string | null) => number | null; allowEmpty: true; };
type CheckedNumericInputCanBeEmptyProps = {
  onChange: ((value: number | null) => void);
  value: number | null;
  allowEmpty: true;
};
type CheckedNumericInputNeverEmptyProps = {
  onChange: ((value: number) => void);
  value: number;
  allowEmpty: false;
};

type ICheckFxnGenProps = ChkFxnAllowEmptyFalse | ChkFxnAllowEmptyTrue;
function CheckFunctionGenerator<T extends ICheckFxnGenProps>(props: T) {
  const MIN: number | null = props.inputProps.min !== undefined && Number.isFinite(props.inputProps.min) ? props.inputProps.min : null;
  const MAX: number | null = props.inputProps.max !== undefined && Number.isFinite(props.inputProps.max) ? props.inputProps.max : null;
  return (e: string | null) => {
    const parsed = e !== null ? props.parseFunction(e) : null;
    if (parsed === null || Number.isNaN(parsed)) {
      if (props.allowEmpty) {
        return null;
      }
      return MIN;
    }
    if (MIN !== null && parsed < MIN) {
      return MIN;
    }
    if (MAX !== null && parsed > MAX) {
      return MAX;
    }
    return parsed;
  }
}

type NeverEmptyProps = ChkFxnAllowEmptyFalse & CheckedNumericInputNeverEmptyProps;
type CanBeEmptyProps = ChkFxnAllowEmptyTrue & CheckedNumericInputCanBeEmptyProps;
type VariadicProps = (NeverEmptyProps | CanBeEmptyProps);
export type ICheckedNumericInput = VariadicProps &
  Omit<TextFieldProps, 'value' | 'onChange' | 'inputProps' | 'onBlur'>;

export function CheckedNumericInput({ onChange, value, inputProps, parseFunction, allowEmpty, ...other }: ICheckedNumericInput) {
  // @ts-ignore
  const CheckFxn = useCallback((v: string | null) => CheckFunctionGenerator({ inputProps, parseFunction, allowEmpty })(v), [allowEmpty, inputProps, parseFunction]);
  const [local_value, setLocalValue] = useState(value !== null ? String(value) : null);
  const [dirty, setDirty] = useState(false);
  const onFinishChangingLocal = () => {
    const new_val = CheckFxn(local_value);
    setDirty(false);
    setLocalValue(new_val !== null ? String(new_val) : null);
    // @ts-ignore
    onChange(new_val);
  }

  const onChangeLocal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDirty(true);
    setLocalValue(event.target.value);
  }

  return (
    <TextField
      {...other}
      value={(dirty ? local_value : value) ?? ""}
      // helperText={dirty && local_value != value ? "Modified" : ""}
      inputProps={inputProps}
      onChange={onChangeLocal}
      onBlur={onFinishChangingLocal}
    />
  )
}
