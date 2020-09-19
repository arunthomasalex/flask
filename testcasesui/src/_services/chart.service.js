export default {
    get
}

function get(url) {
    const requestOptions = {
        method: 'GET'
    };
    return fetch(url, requestOptions);
}