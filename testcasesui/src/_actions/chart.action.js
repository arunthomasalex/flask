import { chartConstants } from '../_constants';
import { chartService } from '../_services';

export default {
    get
}

function get(url = '') {
    return dispatch => {
        dispatch(request())
        chartService.get(url)
            .then(
                data => {
                    dispatch(update(data));
                },
                error => {
                    dispatch(failure());
                }
            )
    }
    function request() { return { type: chartConstants.GET_DATA } }
    function update(data) { return { type: chartConstants.UPDATE_CHART, data } }
    function failure() { return { type: chartConstants.FAILED_TO_FETCH_DATA } }
}