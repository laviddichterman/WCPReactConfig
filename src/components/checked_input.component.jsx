import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';


const CheckedInputComponent = ({onFinishChanging, className, label, type, value}) => {
  const [ local_value, setLocalValue ] = useState(value);
  const [ dirty, setDirty ] = useState(false);

  const CheckForNumberGTZero = (e) => {
    const parsed = parseInt(e);
    return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
  }

  const onFinishChangingLocal = () => {
    const new_val = CheckForNumberGTZero(local_value);
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
      onChange={onChangeLocal}
      onBlur={onFinishChangingLocal}
    />
  )
}

export default CheckedInputComponent;