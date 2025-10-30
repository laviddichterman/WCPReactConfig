import { type ValSetVal } from "../../../utils/common";
import { CheckedNumericInput, type ICheckedNumericInput } from "../CheckedNumericTextInput";

export type IntNumericPropertyComponentProps = {
  min?: number;
  max?: number;
  step?: number;
  label: string;
  disabled: boolean;
  color?: ICheckedNumericInput['color'];
  sx?: ICheckedNumericInput['sx']
} & ValSetVal<number>;

export function IntNumericPropertyComponent(props: IntNumericPropertyComponentProps) {
  return (<CheckedNumericInput
    sx={props.sx}
    type="number"
    fullWidth
    color={props.color}
    label={props.label}
    inputProps={{ inputMode: 'numeric', min: props.min ?? 0, max: props.max ?? 43200, pattern: '[0-9]*', step: props.step ?? 1 }}
    value={props.value}
    disabled={props.disabled}
    onChange={(e) => { props.setValue(e); }}
    parseFunction={parseInt}
    allowEmpty={false} />);
}