import { chartConstants } from '../_constants';
import { chartService } from '../_services';

export default {
    get
}

function get() {
    return dispatch => {
        dispatch(request())
        chartService.getYears()
            .then(
                data => {
                    dispatch(update(data.years));
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