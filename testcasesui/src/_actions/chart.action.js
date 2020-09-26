import { chartConstants } from '../_constants';
import { chartService } from '../_services';

export default {
    getYears,
    getSuites
}

function getYears() {
    return dispatch => {
        dispatch(request())
        chartService.getYears()
            .then(
                data => {
                    dispatch(update(data));
                },
                error => {
                    dispatch(failure());
                }
            )
    }
    function request() { return { type: chartConstants.GET_YEARS } }
    function update(years) { return { type: chartConstants.UPDATED_YEARS, years } }
    function failure() { return { type: chartConstants.FAILED_TO_FETCH_YEARS } }
}

function getSuites() {
    return dispatch => {
        dispatch(request())
        chartService.getSuites()
            .then(
                data => {
                    dispatch(update(data));
                },
                error => {
                    dispatch(failure());
                }
            )
    }
    function request() { return { type: chartConstants.GET_SUITES } }
    function update(suites) { return { type: chartConstants.UPDATED_SUITES, suites } }
    function failure() { return { type: chartConstants.FAILED_TO_FETCH_SUITES } }
}
