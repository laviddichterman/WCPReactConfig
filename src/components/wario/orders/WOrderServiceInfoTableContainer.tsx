import type { WOrderInstance } from "@wcp/wcpshared";
import { ServiceInfoTableComponent } from '@wcp/wario-ux-shared';
import { useAppSelector } from "../../../hooks/useRedux";

export type WOrderServiceInfoTableContainerProps = {
  order: WOrderInstance;
};

export const WOrderServiceInfoTableContainer = ({ order }: WOrderServiceInfoTableContainerProps) => {
  const fulfillmentConfig = useAppSelector(s => s.ws.fulfillments![order.fulfillment.selectedService]);
  return <ServiceInfoTableComponent  customerInfo={order.customerInfo} fulfillment={order.fulfillment} fulfillmentConfig={fulfillmentConfig} specialInstructions={order.specialInstructions ?? ""} />
  
}