import { settingsConstants } from '../_constants';

export function settings(state = {}, action) {
    let settings = action.settings;
    let calendarDetails = action.calendarDetails;
    switch(action.type) {
        case settingsConstants.GET_SETTING_REQUEST:
            return { ...state };
        case settingsConstants.GET_SETTING_SUCCESS:
            return { ...state, settings };
        case settingsConstants.GET_SETTING_FAILURE:
            return { ...state };
        case settingsConstants.ADD_SETTING_REQUEST:
            return { ...state, settingsAdded: true };
        case settingsConstants.ADD_SETTING_SUCCESS:
            return { ...state, settings };
        case settingsConstants.ADD_SETTING_FAILURE:
            return { ...state };
        case settingsConstants.UPDATE_SETTING_REQUEST:
            return { ...state, settingsUpdated: true };
        case settingsConstants.UPDATE_SETTING_SUCCESS:
            return { ...state };
        case settingsConstants.UPDATE_SETTING_FAILURE:
            return { ...state };
        case settingsConstants.GET_CALENDAR_REQUEST:
            return { ...state};
        case settingsConstants.GET_CALENDAR_SUCCESS:
            return { ...state, calendarDetails };
        case settingsConstants.GET_CALENDAR_FAILURE:
            return { ...state };
        case settingsConstants.ADD_CALENDAR_REQUEST:
            return { ...state, calendarDetailsAdded: false };
        case settingsConstants.ADD_CALENDAR_SUCCESS:
            return { ...state, calendarDetailsAdded: true };
        case settingsConstants.ADD_CALENDAR_FAILURE:
            return { ...state, calendarDetailsAdded: false };
        case settingsConstants.UPDATE_CALENDAR_REQUEST:
            return { ...state, calendarDetailsUpdated: false };
        case settingsConstants.UPDATE_CALENDAR_SUCCESS:
            return { ...state, calendarDetailsUpdated: true };
        case settingsConstants.UPDATE_CALENDAR_FAILURE:
            return { ...state, calendarDetailsUpdated: false };
        default:
            return state
    }
}