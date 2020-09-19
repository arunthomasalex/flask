import { settingsConstants } from '../_constants';

export function settings(state = {}, action) {
    let settings = action.settings;
    let oldSettings = state.settings;
    if(oldSettings && settings) {
        for(let setting of oldSettings) {
            if(setting.key === settings.key)
                setting.value = settings.value;
        }
    }
    switch(action.type) {
        case settingsConstants.GET_SETTING_REQUEST:
            return { ...state };
        case settingsConstants.GET_SETTING_SUCCESS:
            return { ...state, settings };
        case settingsConstants.GET_SETTING_FAILURE:
            return { ...state };
        case settingsConstants.ADD_SETTING_REQUEST:
            return { ...state, settingsAdded: true, settings };
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
        case settingsConstants.DELETE_SETTING_REQUEST:
            return { ...state, settingsDeleted: true, data: action.settings };
        case settingsConstants.DELETE_SETTING_SUCCESS:
            return { ...state, data: action.settings };
        case settingsConstants.DELETE_SETTING_FAILURE:
            return { ...state };
        default:
            return state
    }
}