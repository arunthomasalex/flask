import { chartConstants } from '../_constants';

export function chart(state = { years: [ 'Default' ] }, action) {
    const years = action.years;
    console.log(action);
    switch (action.type) {
        case chartConstants.GET_YEARS:
          return { updatedData: false, fetchingData: true };
        case chartConstants.UPDATED_YEARS:
          return { updatedData: true, fetchingData: false, years: [ 'Default', ...years ] };
        case chartConstants.FAILED_TO_FETCH_YEARS:
            return { updatedData: false, fetchingData: false };
        default:
          return state
    }
}