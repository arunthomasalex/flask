import config from 'config';
import { authHeader } from '../_helpers';
import userService from './user.service';

export default {
    get,
    add,
    update,
    delete: _delete
};

function add(key, value) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
    };
    return fetch(`${config.apiUrl}/settings`, requestOptions)
        .then(handleResponse);
}

function update(key, value) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
    };
    return fetch(`${config.apiUrl}/settings`, requestOptions)
        .then(handleResponse);
}

function get(key) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/settings?key=${encodeURI(key)}`, requestOptions)
        .then(handleResponse);
}

function _delete(key) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
    };
    return fetch(`${config.apiUrl}/settings`, requestOptions)
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
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}