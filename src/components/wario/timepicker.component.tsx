import { Autocomplete, TextField } from "@mui/material";


const TimeSelection = ({options, optionCaption="Time", isOptionDisabled=(x) => x.disabled, ...forwardParams}) => (
  <Autocomplete
    options={options}
    isOptionEqualToValue={(o, v) => o.value === v.value}
    getOptionDisabled={isOptionDisabled}
    {...forwardParams}
    renderInput={(params) => <TextField {...params} label={optionCaption} />}
    />
)

export default TimeSelection;