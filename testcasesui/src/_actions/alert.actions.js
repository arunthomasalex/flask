import { alertConstants } from '../_constants';

export default {
    success,
    error,
    clear
};

function success(message) {
    return { type: alertConstants.SUCCESS, message };
}

function error(message) {
    return { type: alertConstants.ERROR, message };
}

function clear() {
    console.log("Inside alert action");
    return { type: alertConstants.CLEAR };
}