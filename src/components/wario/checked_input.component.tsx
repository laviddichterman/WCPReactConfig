import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

const CheckFunctionGenerator = (inputProps, parseFunction, allowEmpty) => (e) => {
    const parsed = parseFunction(e);
    if (Number.isNaN(parsed)) {
      if (!allowEmpty && Number.isFinite(inputProps.min)) {
        return inputProps.min;
      }
      return "";
    }
    
    if (Number.isFinite(inputProps.min) && parsed < inputProps.min) {
      return inputProps.min;
    } 
    if (Number.isFinite(inputProps.max) && parsed > inputProps.max) {
      return inputProps.max;
    }
    return parsed;
    
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
      // helperText={dirty && local_value != value ? "Modified" : ""}
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