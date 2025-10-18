import { ComputeCartSubTotal, ComputeTaxAmount, ComputeTipBasis, ComputeTipValue, DateTimeIntervalBuilder, WOrderInstance } from "@wcp/wario-shared";
import { getFulfillmentById, SelectCatalogSelectors, SelectTaxRate, WCheckoutCartComponent } from '@wcp/wario-ux-shared';
import { useMemo } from "react";
import { useAppSelector } from "../../../hooks/useRedux";
import { selectFullGroupedCartInfo } from "../../../redux/store";


export type WOrderCheckoutCartContainerProps = {
  order: WOrderInstance;
  hideProductDescriptions: boolean;
};

export const WOrderCheckoutCartContainer = (props: WOrderCheckoutCartContainerProps) => {
  const TAX_RATE = useAppSelector(SelectTaxRate);
  const catalogSelectors = useAppSelector(s => SelectCatalogSelectors(s.ws));
  const fulfillmentMaxDuration = useAppSelector(s => getFulfillmentById(s.ws.fulfillments, props.order.fulfillment.selectedService).maxDuration);
  const serviceTimeInterval = useMemo(() => DateTimeIntervalBuilder(props.order.fulfillment, fulfillmentMaxDuration), [props.order.fulfillment, fulfillmentMaxDuration]);
  const fullGroupedCart = useAppSelector(s => selectFullGroupedCartInfo(s, props.order.cart, serviceTimeInterval.start, props.order.fulfillment.selectedService));
  const cartSubtotal = useMemo(() => ComputeCartSubTotal(fullGroupedCart.map(x => x[1]).flat()), [fullGroupedCart]);
  const taxBasis = useMemo(() => ({ currency: cartSubtotal.currency, amount: cartSubtotal.amount - props.order.discounts.reduce((acc, x) => acc + x.discount.amount.amount, 0) }), [props.order, cartSubtotal]);
  const taxAmount = useMemo(() => ComputeTaxAmount(taxBasis, TAX_RATE), [taxBasis, TAX_RATE]);
  const tipBasis = useMemo(() => ComputeTipBasis(cartSubtotal, taxAmount), [cartSubtotal, taxAmount]);
  const tipAmount = useMemo(() => ComputeTipValue(props.order.tip ?? null, tipBasis), [props.order.tip, tipBasis]);

  return <WCheckoutCartComponent
    cart={fullGroupedCart}
    catalogSelectors={catalogSelectors}
    hideProductDescriptions={props.hideProductDescriptions}
    discounts={props.order.discounts}
    payments={props.order.payments}
    selectedService={props.order.fulfillment.selectedService}
    taxRate={TAX_RATE}
    taxValue={taxAmount}
    tipValue={tipAmount}
  />

}