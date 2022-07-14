import { combineReducers } from 'redux';
// slices
import SocketIoReducer from './slices/SocketIoSlice';
// ----------------------------------------------------------------------

export const rootReducer = combineReducers({
  ws: SocketIoReducer
});
