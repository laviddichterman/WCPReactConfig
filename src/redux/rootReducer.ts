import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
});

export { rootPersistConfig, rootReducer };
