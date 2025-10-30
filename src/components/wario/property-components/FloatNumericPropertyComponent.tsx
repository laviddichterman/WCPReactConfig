import { type ValSetVal } from "../../../utils/common";
import { CheckedNumericInput } from "../CheckedNumericTextInput";

export type FloatNumericPropertyComponentProps = {
  min?: number;
  max?: number;
  step?: number;
  label: string;
  disabled: boolean;
} & ValSetVal<number>;

export function FloatNumericPropertyComponent(props: FloatNumericPropertyComponentProps) {
  return (<CheckedNumericInput
    type="number"
    fullWidth
    label={props.label}
    inputProps={{ inputMode: 'decimal', min: props.min ?? 0, max: props.max ?? 99999, pattern: '[0-9]+([.,][0-9]+)?', step: props.step ?? 1 }}
    value={props.value}
    disabled={props.disabled}
    onChange={(e) => { props.setValue(e); }}
    parseFunction={parseFloat}
    allowEmpty={false} />);
}


