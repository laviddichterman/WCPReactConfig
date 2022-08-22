import { TextField, TextFieldProps } from "@mui/material";
import { ValSetVal } from "../../../utils/common";

export type StringPropertyComponentProps = {
  sx?: TextFieldProps['sx'];
  label: string;
  disabled: boolean;
  error?: TextFieldProps['error'];
} & ValSetVal<string>;

export function StringPropertyComponent(props: StringPropertyComponentProps) {
  return (
    <TextField
      sx={props.sx}
      label={props.label}
      type="text"
      fullWidth
      disabled={props.disabled}
      value={props.value}
      onChange={(e) => props.setValue(e.target.value)}
    />)
}