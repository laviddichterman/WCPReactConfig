import { combineReducers } from 'redux';
// slices
import SocketIoReducer from './slices/SocketIoSlice';
import TimingReducer from './slices/TimingSlice';
// ----------------------------------------------------------------------

export const rootReducer = combineReducers({
  ws: SocketIoReducer,
  timing: TimingReducer
});
