import { configureStore, createSelector } from '@reduxjs/toolkit';
import { CatalogSelectors, selectGroupedAndOrderedCart } from '@wcp/wario-ux-shared';
import { CoreCartEntry, CreateProductWithMetadataFromV2Dto, WCPProductV2Dto, WProduct } from '@wcp/wcpshared';
import { rootReducer } from './rootReducer';
//import { SocketAuthMiddleware } from './slices/SocketAuthMiddleware';
import { SocketIoMiddleware } from './slices/SocketIoMiddleware';
// ----------------------------------------------------------------------


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


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;