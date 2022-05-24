import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  mail: mailReducer
});

export { rootPersistConfig, rootReducer };
