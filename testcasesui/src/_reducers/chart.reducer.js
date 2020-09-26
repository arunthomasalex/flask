import { chartConstants } from '../_constants';

export function chart(state = {}, action) {
    const years = action.years;
    const suites = action.suites;
    switch (action.type) {
        case chartConstants.GET_YEARS:
          return { ...state, updatedYears: false, fetchingYears: true };
        case chartConstants.UPDATED_YEARS:
          return { ...state, updatedYears: true, fetchingYears: false, years: [ 'Default', ...years ] };
        case chartConstants.FAILED_TO_FETCH_YEARS:
            return { ...state, updatedYears: false, fetchingYears: false };
        case chartConstants.GET_SUITES:
          return { ...state, updatedSuites: false, fetchingSuites: true };
        case chartConstants.UPDATED_SUITES:
          return { ...state, updatedSuites: true, fetchingSuites: false, suites: [...suites] };
        case chartConstants.FAILED_TO_FETCH_SUITES:
          return { ...state, updatedSuites: false, fetchingSuites: false };
        default:
          return state
    }
}