import { chartConstants } from '../_constants';

export function chart(state = {}, action) {
    switch (action.type) {
        case chartConstants.GET_DATA:
          return { fetchingData: true };
        case chartConstants.UPDATE_CHART:
          return {};
        case chartConstants.FAILED_TO_FETCH_DATA:
            return { fetchingData: false };
        default:
          return state
    }
}