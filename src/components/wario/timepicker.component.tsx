import { Autocomplete, TextField, AutocompleteProps } from "@mui/material";

// probably move to shared react lib

export interface Option { 
  label: string;
  value: number;
}
export interface TimeSelectionProps<T> {
  options : T[];
  optionCaption: string;
  isOptionDisabled: (x : T) => boolean
}

function TimeSelection<T extends Option>({options, optionCaption, isOptionDisabled, ...forwardParams} : TimeSelectionProps<T> & Omit<AutocompleteProps<T, false, true, false>, 'renderInput'>) {
  return <Autocomplete
    disablePortal
    disableClearable
    options={options}
    isOptionEqualToValue={(o, v) => o.value === v.value}
    getOptionDisabled={isOptionDisabled}
    {...forwardParams}
    renderInput={(params) => <TextField {...params} label={optionCaption} />}
    />
}

export default TimeSelection;