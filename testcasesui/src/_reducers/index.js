import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { settings } from './settings.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  settings,
  users,
  alert
});

export default rootReducer;