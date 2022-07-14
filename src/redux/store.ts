import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import SocketIoMiddleware from "./slices/SocketIoMiddleware";
import { ICategoriesAdapter, 
  IOptionTypesAdapter, 
  IOptionsAdapter, 
  IProductInstancesAdapter, 
  IProductsAdapter, 
  ProductInstanceFunctionsAdapter } from './slices/SocketIoSlice';
// ----------------------------------------------------------------------


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: false,
      // immutableCheck: false,
    }).concat([SocketIoMiddleware]),
});

export const ICategoriesSelectors = ICategoriesAdapter.getSelectors((state: RootState) => state.ws.categories);
export const IOptionTypesSelectors = IOptionTypesAdapter.getSelectors((state: RootState) => state.ws.modifiers);
export const IOptionsSelectors = IOptionsAdapter.getSelectors((state: RootState) => state.ws.modifierOptions);
export const IProductInstancesSelectors = IProductInstancesAdapter.getSelectors((state: RootState) => state.ws.productInstances);
export const IProductsSelectors = IProductsAdapter.getSelectors((state: RootState) => state.ws.products);
export const ProductInstanceFunctionsSelectors = ProductInstanceFunctionsAdapter.getSelectors((state: RootState) => state.ws.productInstanceFunctions);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;