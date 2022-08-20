import {FormControlLabel, FormControlLabelProps, Switch, SwitchProps } from "@mui/material";
import { ValSetVal } from "../../../utils/common";

export type ToggleBooleanPropertyComponentProps = {
  sx?: SwitchProps['sx'];
  label: string;
  disabled: boolean;
  labelPlacement?: FormControlLabelProps['labelPlacement'];
} & ValSetVal<boolean>;

export function ToggleBooleanPropertyComponent(props: ToggleBooleanPropertyComponentProps) {
  return (<FormControlLabel
    control={
      <Switch
        sx={props.sx}
        disabled={props.disabled}
        checked={props.value}
        onChange={(e) =>
          props.setValue(e.target.checked)
        }
        name={props.label}
      />
    }
    labelPlacement={props.labelPlacement ?? "top"}
    label={props.label}
  />);
}


