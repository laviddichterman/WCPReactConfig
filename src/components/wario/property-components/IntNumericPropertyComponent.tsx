import { ValSetVal } from "../../../utils/common";
import { CheckedNumericInput } from "../CheckedNumericTextInput";

export type IntNumericPropertyComponentProps = {
  min?: number;
  max?: number;
  step?: number;
  label: string;
  disabled: boolean;
} & ValSetVal<number>;

export function IntNumericPropertyComponent(props: IntNumericPropertyComponentProps) {
  return (<CheckedNumericInput
    type="number"
    size="small"
    label={props.label}
    inputProps={{ inputMode: 'numeric', min: props.min ?? 0, max: props.max ?? 43200, pattern: '[0-9]*', step: props.step ?? 1 }}
    value={props.value}
    disabled={props.disabled}
    onChange={(e) => props.setValue(e)}
    parseFunction={parseInt}
    allowEmpty={false} />);
}