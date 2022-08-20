import { IMoney, RoundToTwoDecimalPlaces } from "@wcp/wcpshared";
import { ValSetVal } from "../../../utils/common";
import { CheckedNumericInput } from "../CheckedNumericTextInput";

export type IMoneyPropertyComponentProps = {
  min?: number;
  max?: number;
  step?: number;
  label: string;
  disabled: boolean;
} & ValSetVal<IMoney>;

export function IMoneyPropertyComponent(props: IMoneyPropertyComponentProps) {
  return (<CheckedNumericInput
    type="number"
    label={props.label}
    inputProps={{ inputMode: 'decimal', min: props.min ?? 0.0, max: props.max ?? 999999, pattern: '[0-9]+([.,][0-9]+)?', step: props.step ?? .25 }}
    value={props.value.amount / 100}
    disabled={props.disabled}
    onChange={(e) => props.setValue({ ...props.value, amount: Math.round(e * 100) })}
    parseFunction={(e) => RoundToTwoDecimalPlaces(parseFloat(e === null ? "0" : e))}
    allowEmpty={false} />);
}


