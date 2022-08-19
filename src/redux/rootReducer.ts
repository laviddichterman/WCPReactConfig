import { combineReducers } from 'redux';
// slices
import SocketIoReducer from './slices/SocketIoSlice';
import WMetricsReducer from './slices/WMetricsSlice';
import BlockOffReducer from './slices/BlockOffSlice';
// ----------------------------------------------------------------------

export const rootReducer = combineReducers({
  ws: SocketIoReducer,
  metrics: WMetricsReducer,
  blockOff: BlockOffReducer
});
