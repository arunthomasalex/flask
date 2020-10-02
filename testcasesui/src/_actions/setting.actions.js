import { settingService } from '../_services';
import { settingsConstants } from '../_constants';

const { default: alertActions } = require('./alert.actions');

export default {
    getTarget,
    addTarget,
    updateTarget,
    getCalendarDetails,
    addCalendarDetails,
    updateCalendarDetails,
    // deleteCalendarDetails
};

function getTarget(key = '') {
    return dispatch => {
        dispatch(request());
        settingService.getTarget(key)
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

function addTarget(key, value) {
    return dispatch => {
        dispatch(request({ key, value }));
        settingService.addTarget(key, value)
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

function updateTarget(key, value ) {
    return dispatch => new Promise((resolve, reject) => {
        dispatch(request());
        settingService.updateTarget(key, value)
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

function getCalendarDetails(month, year) {
	return dispatch => {
        dispatch(request());
        return settingService.getCalendarDetails(month, year)
            .then(
                details => {
                    dispatch(success(details));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
    }
    function request() { return { type: settingsConstants.GET_CALENDAR_REQUEST } }
    function success(calendarDetails) { return { type: settingsConstants.GET_CALENDAR_SUCCESS, calendarDetails } }
    function failure(error) { return { type: settingsConstants.GET_CALENDAR_FAILURE, error } }
}

function addCalendarDetails(date, data) {
	return dispatch => {
        dispatch(request());
        return settingService.addCalendarDetails(date, data)
            .then(details => {
                    dispatch(success(details.data));
                    dispatch(alertActions.success(details.message));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    }
    function request() { return { type: settingsConstants.ADD_CALENDAR_REQUEST } }
    function success(data) { return { type: settingsConstants.ADD_CALENDAR_SUCCESS, data } }
    function failure(error) { return { type: settingsConstants.ADD_CALENDAR_FAILURE, error } }
}

function updateCalendarDetails(data) {
	return dispatch => {
        dispatch(request());
        return settingService.updateCalendarDetails(data)
            .then(
                details => {
                    dispatch(success());
                    dispatch(alertActions.success(details.message));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    }
    function request() { return { type: settingsConstants.UPDATE_CALENDAR_REQUEST } }
    function success() { return { type: settingsConstants.UPDATE_CALENDAR_SUCCESS } }
    function failure(error) { return { type: settingsConstants.UPDATE_CALENDAR_FAILURE, error } }
}