import { EventInput } from '@fullcalendar/react';
import { configureStore, createSelector } from '@reduxjs/toolkit';
import { CatalogSelectors, selectGroupedAndOrderedCart } from '@wcp/wario-ux-shared';
import { CoreCartEntry, CreateProductWithMetadataFromV2Dto, DateTimeIntervalBuilder, EventTitleStringBuilder, RebuildAndSortCart, WCPProductV2Dto, WDateUtils, WOrderInstance, WOrderStatus } from '@wcp/wcpshared';
import { rootReducer } from './rootReducer';
import { getWOrderInstances } from './slices/OrdersSlice';
//import { SocketAuthMiddleware } from './slices/SocketAuthMiddleware';
import { SocketIoMiddleware } from './slices/SocketIoMiddleware';
// ----------------------------------------------------------------------

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([SocketIoMiddleware /*, SocketAuthMiddleware*/])
  },
});

export const selectCoreCartWProduct = createSelector(
  (s: RootState, _: CoreCartEntry<WCPProductV2Dto>[], __: Date | number, ___: string) => CatalogSelectors(s.ws),
  (_: RootState, cart: CoreCartEntry<WCPProductV2Dto>[], __: Date | number, ___: string) => cart,
  (_: RootState, ___: CoreCartEntry<WCPProductV2Dto>[], serviceTime: Date | number, __: string) => serviceTime,
  (_: RootState, __: CoreCartEntry<WCPProductV2Dto>[], ___: Date | number, fulfillmentId: string) => fulfillmentId,
  (catalogSelectors, cart, serviceTime, fulfillmentId) =>
    cart.map(x => ({ ...x, product: CreateProductWithMetadataFromV2Dto(x.product, catalogSelectors, serviceTime, fulfillmentId) }))
)

export const selectFullGroupedCartInfo = createSelector(
  (s: RootState) => s,
  (s: RootState, cart: CoreCartEntry<WCPProductV2Dto>[], serviceTime: Date | number, fulfillmentId: string) => selectCoreCartWProduct(s, cart, serviceTime, fulfillmentId),
  (s, cart) => selectGroupedAndOrderedCart(s, cart)
)

export const selectRebuiltSortedCart = createSelector(
  (s: RootState, _: WOrderInstance) => CatalogSelectors(s.ws),
  (_: RootState, order: WOrderInstance) => WDateUtils.ComputeServiceDateTime(order.fulfillment),
  (_: RootState, order: WOrderInstance) => order.fulfillment.selectedService,
  (_: RootState, order: WOrderInstance) => order.cart,
  (catalogSelectors, serviceTime, fulfillmentId, cart) => RebuildAndSortCart(cart, catalogSelectors, serviceTime, fulfillmentId)
)

export const selectEventTitleStringForOrder = createSelector(
  (s: RootState, _: WOrderInstance) => CatalogSelectors(s.ws),
  (s: RootState, order: WOrderInstance) => s.ws.fulfillments![order.fulfillment.selectedService],
  (_: RootState, order: WOrderInstance) => order,
  (s: RootState, order: WOrderInstance) => selectRebuiltSortedCart(s, order),
  (catalogSelectors, fulfillmentConfig, order, rebuiltCart) => EventTitleStringBuilder(catalogSelectors, fulfillmentConfig, `${order.customerInfo.givenName} ${order.customerInfo.familyName}`, order.fulfillment, rebuiltCart, order.specialInstructions ?? "" )
)

export const selectOrderAsEvent = createSelector(
  (s: RootState, order: WOrderInstance) => s.ws.fulfillments![order.fulfillment.selectedService],
  (_: RootState, order: WOrderInstance) => order,
  selectEventTitleStringForOrder,
  (fulfillmentConfig, order, eventTitle): EventInput => {
    const dateTimeInterval = DateTimeIntervalBuilder(order.fulfillment, fulfillmentConfig);
    return { 
      id: order.id, 
      title: eventTitle,
      allDay: false, 
      start: dateTimeInterval.start,
      end: dateTimeInterval.end,
    };
  }
)

export const selectOrdersAsEvents = createSelector(
  (s: RootState) => s,
  (s: RootState) => getWOrderInstances(s.orders.orders),
  (s, orders): EventInput[] => orders.filter(x=>x.status !== WOrderStatus.CANCELED).map(x=>selectOrderAsEvent(s, x))
)

export const selectOrdersNeedingAttention = createSelector(
  (s: RootState) => getWOrderInstances(s.orders.orders),
  (orders) => orders.filter(x=>x.status === WOrderStatus.OPEN)
)

