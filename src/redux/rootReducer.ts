import { combineReducers } from 'redux';
// slices
import { SocketIoReducer } from '@wcp/wario-ux-shared';
import WMetricsReducer from './slices/WMetricsSlice';
import BlockOffReducer from './slices/BlockOffSlice';
// ----------------------------------------------------------------------

export const rootReducer = combineReducers({
  ws: SocketIoReducer,
  metrics: WMetricsReducer,
  blockOff: BlockOffReducer
});
