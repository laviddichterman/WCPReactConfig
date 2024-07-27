import { EventInput } from '@fullcalendar/core';
import { configureStore, createSelector } from '@reduxjs/toolkit';
import { weakMapCreateSelector, lruMemoizeOptionsWithSize, CatalogSelectors, selectGroupedAndOrderedCart, getProductEntryById, getProductInstanceById, getProductEntries, getFulfillmentById, getCategoryEntryById, SelectBaseProductNameByProductId, SelectParentProductEntryFromProductInstanceId } from '@wcp/wario-ux-shared';
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

export const selectCoreCartWProduct = weakMapCreateSelector(
  (s: RootState, _: CoreCartEntry<WCPProductV2Dto>[], __: Date | number, ___: string) => s.ws,
  (_: RootState, cart: CoreCartEntry<WCPProductV2Dto>[], __: Date | number, ___: string) => cart,
  (_: RootState, ___: CoreCartEntry<WCPProductV2Dto>[], serviceTime: Date | number, __: string) => serviceTime,
  (_: RootState, __: CoreCartEntry<WCPProductV2Dto>[], ___: Date | number, fulfillmentId: string) => fulfillmentId,
  (webSocketState, cart, serviceTime, fulfillmentId) =>
    cart.map(x => ({ ...x, product: CreateProductWithMetadataFromV2Dto(x.product, CatalogSelectors(webSocketState), serviceTime, fulfillmentId) }))
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

export const selectSelectedFulfillment = createSelector(
  (s: RootState, _: WOrderInstance) => s.ws.fulfillments,
  (_: RootState, order: WOrderInstance) => order.fulfillment.selectedService,
  (fulfillments, selectedFulfillmentId) => getFulfillmentById(fulfillments, selectedFulfillmentId)
)

export const selectEventTitleStringForOrder = weakMapCreateSelector(
  (s: RootState, _: WOrderInstance) => s.ws.categories,
  (s: RootState, _: WOrderInstance) => s.ws.productInstances,
  (s: RootState, order: WOrderInstance) => selectSelectedFulfillment(s, order),
  (_: RootState, order: WOrderInstance) => order,
  (s: RootState, order: WOrderInstance) => selectRebuiltSortedCart(s, order),
  (categories, productInstances, fulfillmentConfig, order, rebuiltCart) => EventTitleStringBuilder(
    { category: (id: string) => getCategoryEntryById(categories, id), productInstance: (id: string) => getProductInstanceById(productInstances, id) },
    fulfillmentConfig, 
    `${order.customerInfo.givenName} ${order.customerInfo.familyName}`, 
    order.fulfillment, 
    rebuiltCart, 
    order.specialInstructions ?? ""));

export const selectOrderAsEvent = weakMapCreateSelector(
  (s: RootState, order: WOrderInstance) => selectSelectedFulfillment(s, order).maxDuration,
  (_: RootState, order: WOrderInstance) => order,
  selectEventTitleStringForOrder,
  (fulfillmentMaxDuration, order, eventTitle): EventInput => {
    const dateTimeInterval = DateTimeIntervalBuilder(order.fulfillment, fulfillmentMaxDuration);
    return {
      id: order.id,
      title: eventTitle,
      allDay: false,
      start: dateTimeInterval.start,
      end: dateTimeInterval.end,
    };
  },
  lruMemoizeOptionsWithSize(70)
);

export const selectOrdersAsEvents = createSelector(
  (s: RootState) => s,
  (s: RootState) => getWOrderInstances(s.orders.orders),
  (s, orders): EventInput[] => orders.filter(x => x.status !== WOrderStatus.CANCELED).map(x => selectOrderAsEvent(s, x)),
  lruMemoizeOptionsWithSize(5)
);

/**
 * Returns the orders for the current date that are in the OPEN state
 */
export const selectOrdersNeedingAttention = createSelector(
  (s: RootState) => getWOrderInstances(s.orders.orders),
  (s: RootState) => WDateUtils.formatISODate(s.ws.currentTime),
  (orders, currentDate) => orders.filter(x => x.status === WOrderStatus.OPEN && x.fulfillment.selectedDate === currentDate)
);

export const selectBaseProductName = (s: RootState, productClassId: string) => SelectBaseProductNameByProductId(s.ws, productClassId);

export const selectParentProductEntryFromProductInstanceId = (s: RootState, productId: string) => SelectParentProductEntryFromProductInstanceId(s.ws, productId);

export const selectProductsAfterDisableFilter = weakMapCreateSelector(
  (s: RootState) => getProductEntries(s.ws.products),
  (s: RootState) => s.catalog.hideDisabledProducts,
  (products, hideDisabledProducts) => !hideDisabledProducts ? products : products.filter((x) =>
    (!x.product.disabled || x.product.disabled.start <= x.product.disabled.end))
);

export const selectProductIdsAfterDisableFilter = weakMapCreateSelector(
  (s: RootState) => getProductEntries(s.ws.products),
  (s: RootState) => s.catalog.hideDisabledProducts,
  (products, hideDisabledProducts) => (!hideDisabledProducts ? products : products.filter((x) =>
    (!x.product.disabled || x.product.disabled.start <= x.product.disabled.end))).map(x=>x.product.id)
);

export const selectProductIdsInCategoryAfterDisableFilter = weakMapCreateSelector(
  (s: RootState, _: string) => selectProductsAfterDisableFilter(s),
  (_: RootState, categoryId: string) => categoryId,
  (productsAfterDisableFilter, categoryId) => productsAfterDisableFilter.filter((x) =>
    x.product.category_ids.includes(categoryId)).map(x=>x.product.id)
);

export const selectOrphanedProductIds = weakMapCreateSelector(
  (s: RootState) => getProductEntries(s.ws.products),
  (products) => products.filter(
    (x) =>
      x.product.category_ids.filter((x) => x && x.length > 0).length === 0
  ).map(x=>x.product.id)
);
