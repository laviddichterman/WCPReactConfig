import { ComputeCartSubTotal, ComputeTaxAmount, ComputeTipBasis, ComputeTipValue, CreditPayment, DateTimeIntervalBuilder, PaymentMethod, StoreCreditPayment, WOrderInstance } from "@wcp/wcpshared";
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
  const cartSubtotal = useMemo(() => ComputeCartSubTotal(fullGroupedCart.map(x => x[1]).flat()), [fullGroupedCart]);
  const taxBasis = useMemo(() => ({ currency: cartSubtotal.currency, amount: cartSubtotal.amount - props.order.discounts.reduce((acc, x)=>acc + x.discount.amount.amount, 0) }), [props.order, cartSubtotal]);
  const taxAmount = useMemo(() => ComputeTaxAmount(taxBasis, TAX_RATE), [taxBasis, TAX_RATE]);
  const tipBasis = useMemo(() => ComputeTipBasis(cartSubtotal, taxAmount), [cartSubtotal, taxAmount]);
  const tipAmount = useMemo(() => ComputeTipValue(props.order.tip ?? null, tipBasis), [props.order.tip, tipBasis]);

  return <WCheckoutCartComponent
    payments={props.order.payments.filter(x => x.t === PaymentMethod.CreditCard) as CreditPayment[]}
    hideProductDescriptions={props.hideProductDescriptions}
    cart={fullGroupedCart}
    catalogSelectors={catalogSelectors}
    discountCreditsApplied={[]}
    giftCreditsApplied={props.order.payments.filter(x => x.t === PaymentMethod.StoreCredit).map((x: StoreCreditPayment) => ({ amount: x.amount, code: x.payment.code }))}
    selectedService={props.order.fulfillment.selectedService}
    taxRate={TAX_RATE}
    taxValue={taxAmount}
    tipValue={tipAmount} />

}