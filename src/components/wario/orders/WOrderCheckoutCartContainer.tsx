import { DateTimeIntervalBuilder, WOrderInstance } from "@wcp/wcpshared";
import { useMemo } from "react";
import { CatalogSelectors, SelectTaxRate, WCheckoutCartComponent } from '@wcp/wario-ux-shared';
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { selectFullGroupedCartInfo } from "../../../redux/store";


export type WOrderCheckoutCartContainerProps = {
  order: WOrderInstance;
  hideProductDescriptions: boolean;
};


export const WOrderCheckoutCartContainer = (props: WOrderCheckoutCartContainerProps) => {
  const TAX_RATE = useAppSelector(SelectTaxRate);
  const catalogSelectors = useAppSelector(s => CatalogSelectors(s.ws));
  const fulfillment = useAppSelector(s => s.ws.fulfillments![props.order.fulfillment.selectedService]);
  const serviceTimeInterval = useMemo(() => DateTimeIntervalBuilder(props.order.fulfillment, fulfillment), [props.order.fulfillment, fulfillment]);
  const fullGroupedCart = useAppSelector(s => selectFullGroupedCartInfo(s, props.order.cart, serviceTimeInterval.start, props.order.fulfillment.selectedService));

  return <WCheckoutCartComponent payments={[]/*order.payments.filter(x=>x.t === PaymentMethod.CreditCard) as CreditPayment[]*/} hideProductDescriptions={props.hideProductDescriptions} cart={fullGroupedCart} catalogSelectors={catalogSelectors} discountCreditsApplied={[]} giftCreditsApplied={[]} selectedService={props.order.fulfillment.selectedService} taxRate={TAX_RATE} taxValue={{ currency: "USD", amount: 0 }} tipValue={{ currency: "USD", amount: 0 }} />
  
}