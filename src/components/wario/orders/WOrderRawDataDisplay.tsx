import { useAppSelector } from "../../../hooks/useRedux";

import { ElementActionComponentProps } from "../menu/element.action.component";

import { getWOrderInstanceById } from "../../../redux/slices/OrdersSlice";
import { CardContent } from '@mui/material';

type WOrderRawDataDisplayProps = { orderId: string; onCloseCallback: ElementActionComponentProps['onCloseCallback'] };
const WOrderRawDataDisplayComponent = (props: WOrderRawDataDisplayProps) => {
  const order = useAppSelector(s => getWOrderInstanceById(s.orders.orders, props.orderId))!;
  return (<CardContent>
    {JSON.stringify(order, null, 2)}
  </CardContent>)
};

export default WOrderRawDataDisplayComponent;
