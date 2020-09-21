import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { settings } from './settings.reducer';
import { chart } from './chart.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  settings,
  users,
  alert,
  chart
});

export default rootReducer;