import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { SocketIoMiddleware } from './slices/SocketIoMiddleware';
// ----------------------------------------------------------------------


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([SocketIoMiddleware])
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;