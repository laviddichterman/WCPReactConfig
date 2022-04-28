import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

const CheckFunctionGenerator = (inputProps, parseFunction, allowEmpty) => {
  return (e) => {
    const parsed = parseFunction(e);
    if (isNaN(parsed)) {
      return allowEmpty ? "" : (Number.isFinite(inputProps.min) ? inputProps.min : "");
    }
    else {
      return Number.isFinite(inputProps.min) && parsed < inputProps.min ? inputProps.min : (Number.isFinite(inputProps.max) && parsed > inputProps.max ? inputProps.max : parsed);
    }
  }
}

const CheckedInputComponent = ({onFinishChanging, className, parseFunction, allowEmpty, inputProps, label, type, value, ...forwardParams}) => {
  const [ local_value, setLocalValue ] = useState(value);
  const [ dirty, setDirty ] = useState(false);
  const onFinishChangingLocal = () => {
    const new_val = CheckFunctionGenerator(inputProps, parseFunction, allowEmpty)(local_value);
    setDirty(false);
    setLocalValue(new_val);
    onFinishChanging(new_val);
  }

  const onChangeLocal = (e) => {
    setDirty(true);
    setLocalValue(e.target.value);
  }

  return (
    <TextField
      {...forwardParams}
      label={label}
      type={type}
      className={className}
      value={dirty ? local_value : value}
      size="small"
      //helperText={dirty && local_value != value ? "Modified" : ""}
      inputProps={inputProps}
      onChange={onChangeLocal}
      onBlur={onFinishChangingLocal}
    />
  )
}

CheckedInputComponent.defaultProps = {
  parseFunction: parseInt,
  allowEmpty: false
};

export default CheckedInputComponent;