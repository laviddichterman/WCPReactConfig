import { Autocomplete, TextField, AutocompleteProps } from "@mui/material";
import { useMemo } from "react";
// probably move to shared react lib

// maybe this is useless though

export interface Option { 
  label: string;
  value: number;
  disabled: boolean;
}
export interface TimeSelectionProps<T> {
  options : readonly T[];
  optionCaption: string;
}

function TimeSelection<T extends Option>({options, optionCaption, ...forwardParams} : TimeSelectionProps<T> & Omit<AutocompleteProps<number, false, true, false>, 'options' | 'renderInput'>) {
  const optionsMap = useMemo(() => options.reduce((acc, v)=>({...acc, [v.value]: v}), {} as Record<number, T>), [options]);
  return <Autocomplete
    disablePortal
    disableClearable
    options={options.map(x=>x.value)}
    isOptionEqualToValue={(o, v) => o === v}
    getOptionDisabled={(o) => optionsMap[o].disabled}
    {...forwardParams}
    renderInput={(params) => <TextField {...params} label={optionCaption} />}
    />
}

export default TimeSelection;