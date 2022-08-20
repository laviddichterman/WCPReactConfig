import { TextField } from "@mui/material";
import { ValSetVal } from "src/utils/common";

export type StringPropertyComponentProps = {
  label: string;
  disabled: boolean;
} & ValSetVal<string>;

export function StringPropertyComponent(props: StringPropertyComponentProps) {
  return (
    <TextField
      label={props.label}
      type="text"
      fullWidth
      disabled={props.disabled}
      value={props.value}
      size="small"
      onChange={(e) => props.setValue(e.target.value)}
    />)
}