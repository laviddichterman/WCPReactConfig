import { combineReducers } from 'redux';
// slices
import { SocketIoReducer } from '@wcp/wario-ux-shared';
import BlockOffReducer from './slices/BlockOffSlice';
// ----------------------------------------------------------------------

export const rootReducer = combineReducers({
  ws: SocketIoReducer,
  blockOff: BlockOffReducer
});
