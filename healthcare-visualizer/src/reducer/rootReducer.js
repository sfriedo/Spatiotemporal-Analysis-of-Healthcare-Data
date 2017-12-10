import { combineReducers } from 'redux';
import ApiReducer from './apiReducer';

const rootReducer = combineReducers({
  api: ApiReducer,
});

export default rootReducer;
