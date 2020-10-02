import { alertConstants } from '../_constants';

export function alert(state = [], action) {
  switch (action.type) {
    case alertConstants.SUCCESS:
      state.push({
        type: 'alert-success',
        message: action.message
      });
      return state;
    case alertConstants.ERROR:
      state.push({
        type: 'alert-danger',
        message: action.message
      });
      return state;
    case alertConstants.CLEAR:
      return [];
    default:
      return state
  }
}