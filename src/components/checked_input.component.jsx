import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

const CheckForNumberGTZero = (e) => {
  const parsed = parseInt(e);
  return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
};

const CheckedInputComponent = ({onFinishChanging, className, checkFunction, inputProps, label, type, value}) => {
  const [ local_value, setLocalValue ] = useState(value);
  const [ dirty, setDirty ] = useState(false);
  const onFinishChangingLocal = () => {
    const new_val = checkFunction(local_value);
    setLocalValue(new_val);
    setDirty(false);
    onFinishChanging(new_val);
  }

  const onChangeLocal = (e) => {
    setDirty(true);
    setLocalValue(e.target.value);
  }

  return (
    <TextField
      label={label}
      type={type}
      className={className}
      value={dirty ? local_value : value}
      size="small"
      inputProps={inputProps}
      onChange={onChangeLocal}
      onBlur={onFinishChangingLocal}
    />
  )
}

CheckedInputComponent.defaultProps = {
  checkFunction: CheckForNumberGTZero
};

export default CheckedInputComponent;