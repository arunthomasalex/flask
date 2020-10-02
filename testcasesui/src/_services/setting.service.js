import config from 'config';
import { authHeader } from '../_helpers';
import userService from './user.service';

export default {
    getTarget,
    addTarget,
    updateTarget,
    deleteTarget,
    getCalendarDetails,
    addCalendarDetails,
    updateCalendarDetails
};

function addTarget(key, value) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
    };
    return fetch(`${config.apiUrl}/settings`, requestOptions)
        .then(handleResponse);
}

function updateTarget(key, value) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
    };
    return fetch(`${config.apiUrl}/settings`, requestOptions)
        .then(handleResponse);
}

function getTarget(key) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/settings?key=${encodeURI(key)}`, requestOptions)
        .then(handleResponse);
}

function deleteTarget(key) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
    };
    return fetch(`${config.apiUrl}/settings`, requestOptions)
        .then(handleResponse);
}

function getCalendarDetails(month, year) {
    const queryString = Object.entries({ month, year }).map(([key, value]) => `${key}=${value}`).join('&');
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/calendar?${queryString}`, requestOptions)
        .then(handleResponse);
}

function addCalendarDetails(date, data) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, data })
    }
    console.log(JSON.stringify({ date, data }));
    return fetch(`${config.apiUrl}/calendar`, requestOptions)
        .then(handleResponse);
}

function updateCalendarDetails(data) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
    }
    return fetch(`${config.apiUrl}/calendar`, requestOptions)
        .then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                userService.logout();
                location.reload(true);
            }
            throw (data && data.message) || response.statusText;
        }
        return data;
    });
}