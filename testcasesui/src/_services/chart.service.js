import config from 'config';

export default {
    getYears,
    getTestcases
}

function getTestcases(year) {
    const requestOptions = {
        method: 'GET'
    };
    const url = `${config.apiUrl}/testcases${year ? ('?year=' + year) : ''}`
    return fetch(url, requestOptions)
            .then(handleResponse);
}

function getYears() {
    const requestOptions = {
        method: 'GET'
    };
    return fetch(`${config.apiUrl}/years`, requestOptions)
            .then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}