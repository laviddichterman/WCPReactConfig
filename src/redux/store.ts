import { EventInput } from '@fullcalendar/core';
import { configureStore, createSelector, createSelectorCreator, lruMemoize, weakMapMemoize } from '@reduxjs/toolkit';
import { CatalogSelectors, selectGroupedAndOrderedCart, getProductEntryById, getProductInstanceById, getProductEntries, getFulfillmentById, getCategoryEntryById } from '@wcp/wario-ux-shared';
import { CoreCartEntry, CreateProductWithMetadataFromV2Dto, DateTimeIntervalBuilder, EventTitleStringBuilder, RebuildAndSortCart, WCPProductV2Dto, WDateUtils, WOrderInstance, WOrderStatus } from '@wcp/wcpshared';
import { shallowEqual } from 'react-redux';
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

export const localCreateSelector = createSelectorCreator({
  memoize: weakMapMemoize,
  argsMemoize: weakMapMemoize
});

export const lruMemoizeOptionsWithSize = (size: number) => ({
  memoize: lruMemoize,
  memoizeOptions: {
    equalityCheck: shallowEqual,
    resultEqualityCheck: shallowEqual,
    maxSize: size
  },
  argsMemoize: lruMemoize,
  argsMemoizeOptions: {
    equalityCheck: shallowEqual,
    resultEqualityCheck: shallowEqual,
    maxSize: size
  }
});

export const selectCoreCartWProduct = localCreateSelector(
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

export const selectEventTitleStringForOrder = localCreateSelector(
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

export const selectOrderAsEvent = localCreateSelector(
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

export const selectBaseProductName = localCreateSelector(
  (s: RootState, productClassId: string) => getProductEntryById(s.ws.products, productClassId),
  (s: RootState, _: string) => s.ws.productInstances,
  (productEntry, productInstances) =>
    productEntry ? getProductInstanceById(productInstances, productEntry.product.baseProductId)?.displayName ?? "UNDEFINED" : "UNDEFINED",
);

export const selectParentProductEntryFromProductInstanceId = localCreateSelector(
  (s: RootState) => s.ws.products,
  (s: RootState, productInstanceId: string) => getProductInstanceById(s.ws.productInstances, productInstanceId),
  (products, productInstance) =>
    productInstance ? getProductEntryById(products, productInstance.productId) : undefined,
);

export const selectProductsAfterDisableFilter = localCreateSelector(
  (s: RootState) => getProductEntries(s.ws.products),
  (s: RootState) => s.catalog.hideDisabledProducts,
  (products, hideDisabledProducts) => !hideDisabledProducts ? Object.values(products) : Object.values(products).filter((x) =>
    (!x.product.disabled || x.product.disabled.start <= x.product.disabled.end))
);

export const selectProductIdsAfterDisableFilter = localCreateSelector(
  (s: RootState) => getProductEntries(s.ws.products),
  (s: RootState) => s.catalog.hideDisabledProducts,
  (products, hideDisabledProducts) => (!hideDisabledProducts ? Object.values(products) : Object.values(products).filter((x) =>
    (!x.product.disabled || x.product.disabled.start <= x.product.disabled.end))).map(x=>x.product.id)
);

export const selectProductIdsInCategoryAfterDisableFilter = localCreateSelector(
  (s: RootState, _: string) => selectProductsAfterDisableFilter(s),
  (_: RootState, categoryId: string) => categoryId,
  (productsAfterDisableFilter, categoryId) => Object.values(productsAfterDisableFilter).filter((x) =>
    x.product.category_ids.includes(categoryId)).map(x=>x.product.id)
);

// export const selectDetailPanelSizeForRowId = localCreateSelector(
//   (s: RootState, categoryId: string) => selectProductIdsInCategoryAfterDisableFilter(s, categoryId),
//   (s: RootState, categoryId: string) => getDetailPanelSizeById(s.catalog.detailPanelSizes, categoryId),
//   (productsInCategory, detailPanelSizeEntry) => { 
//     return productsInCategory.length ? ((detailPanelSizeEntry ? detailPanelSizeEntry.size : 0) + 41 + (productsInCategory.length * 36)) : 0;
//   }
// )

// export const selectDisableDataForProductId = localCreateSelector(
//   (s: RootState, productClassId: string, __: boolean) => getProductEntryById(s.ws.products, productClassId),
//   (s: RootState, _: string, __: boolean) => s.ws.currentTime,
//   (_: RootState, __: string, considerAvailability: boolean) => considerAvailability,
//   (productEntry, currentTime, considerAvailability) => { 
//     return DisableDataCheck(productEntry.product.disabled, considerAvailability ? productEntry.product.availability : null, currentTime);
//   }
// );

export const selectOrphanedProductIds = localCreateSelector(
  (s: RootState) => getProductEntries(s.ws.products),
  (products) => products.filter(
    (x) =>
      x.product.category_ids.filter((x) => x && x.length > 0).length === 0
  ).map(x=>x.product.id)
);
