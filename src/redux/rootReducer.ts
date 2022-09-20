import { combineReducers } from 'redux';
// slices
import { SocketIoReducer } from '@wcp/wario-ux-shared';
import BlockOffReducer from './slices/BlockOffSlice';
import { SocketAuthReducer } from './slices/OrdersSlice';
// ----------------------------------------------------------------------

export const rootReducer = combineReducers({
  ws: SocketIoReducer,
  wsAuth: SocketAuthReducer,
  blockOff: BlockOffReducer
});
