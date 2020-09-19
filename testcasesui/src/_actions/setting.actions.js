import { settingService } from '../_services';
import { settingsConstants } from '../_constants';

const { default: alertActions } = require('./alert.actions');

export default {
    get,
    add,
    update,
    delete: _delete
};

function get(key = '') {
    return dispatch => {
        dispatch(request());
        settingService.get(key)
            .then(
                settings => {
                    dispatch(success(settings));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
    }
    function request() { return { type: settingsConstants.GET_SETTING_REQUEST } }
    function success(settings) { return { type: settingsConstants.GET_SETTING_SUCCESS, settings } }
    function failure(error) { return { type: settingsConstants.GET_SETTING_FAILURE, error } }
}

function add(key, value) {
    return dispatch => {
        dispatch(request({ key, value }));
        settingService.add(key, value)
            .then(
                setting => {
                    dispatch(success(setting));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
    }
    function request(settings) { return { type: settingsConstants.ADD_SETTING_REQUEST, settings } }
    function success(settings) { return  { type: settingsConstants.ADD_SETTING_SUCCESS, settings } }
    function failure(error) { return { type: settingsConstants.ADD_SETTING_FAILURE, error } }
}

function update(key, value ) {
    return dispatch => new Promise((resolve, reject) => {
        dispatch(request());
        settingService.update(key, value)
            .then(
                setting => {
                    dispatch(success(setting));
                    resolve()
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    reject()
                }
            )
    });
    function request() { return { type: settingsConstants.UPDATE_SETTING_REQUEST } }
    function success(settings) { return { type: settingsConstants.UPDATE_SETTING_SUCCESS, settings } }
    function failure(error) { return { type: settingsConstants.UPDATE_SETTING_FAILURE, error } }
}

function _delete(key) {
    return dispatch => new Promise((resolve, reject) => {
        dispatch(request({ key }));
        settingService.delete(key)
            .then(
                setting => {
                    dispatch(success(setting));
                    resolve();
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    reject();
                }
            )
    });
    function request(settings) { return { type: settingsConstants.DELETE_SETTING_REQUEST, settings } }
    function success(settings) { return { type: settingsConstants.DELETE_SETTING_SUCCESS, settings } }
    function failure(error) { return { type: settingsConstants.DELETE_SETTING_FAILURE, error } }
}