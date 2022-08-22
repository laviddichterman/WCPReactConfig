import { Box, FormControlLabel, FormControlLabelProps, Switch, SwitchProps } from "@mui/material";
import { ValSetVal } from "../../../utils/common";

export type ToggleBooleanPropertyComponentProps = {
  sx?: SwitchProps['sx'];
  label: string;
  disabled: boolean;
  labelPlacement?: FormControlLabelProps['labelPlacement'];
} & ValSetVal<boolean>;

export function ToggleBooleanPropertyComponent(props: ToggleBooleanPropertyComponentProps) {
  const labelPlacement = props.labelPlacement ?? 'top';
  return (
    <Box sx={labelPlacement==='top' ? { display: 'flex', alignContent: "center", textAlign: 'center',
    justifyContent: 'center', width:'100%', mx: 'auto'} : {}}>
  <FormControlLabel
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
    labelPlacement={labelPlacement}
    label={props.label}
  /></Box>);
}


