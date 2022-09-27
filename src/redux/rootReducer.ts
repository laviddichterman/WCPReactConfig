import { combineReducers } from 'redux';
// slices
import { SocketIoReducer } from '@wcp/wario-ux-shared';
import BlockOffReducer from './slices/BlockOffSlice';
import { OrdersReducer } from './slices/OrdersSlice';
// ----------------------------------------------------------------------

export const rootReducer = combineReducers({
  ws: SocketIoReducer,
  orders: OrdersReducer,
  blockOff: BlockOffReducer
});
