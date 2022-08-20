import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { kebabCase, snakeCase, startCase } from "lodash";
import { ValSetVal } from "src/utils/common";

export type StringEnumPropertyComponentProps<TEnum> = {
  options: (keyof TEnum)[];
  label: string;
  disabled: boolean;
} & ValSetVal<keyof TEnum>;

export function StringEnumPropertyComponent<T>(props: StringEnumPropertyComponentProps<T>) {
  return (<FormControl component="fieldset">
    <FormLabel component="legend">{props.label}</FormLabel>
    <RadioGroup
      aria-label={kebabCase(props.label)}
      name={kebabCase(props.label)}
      row
      value={props.value}
      onChange={(e) => props.setValue(e.target.value as keyof T)}
    >
      {props.options.map((opt, i) =>
        <FormControlLabel
          key={i}
          value={opt}
          control={<Radio />}
          label={startCase(snakeCase(String(opt)))}
        />
      )}
    </RadioGroup>
  </FormControl >);
}


