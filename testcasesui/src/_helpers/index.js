const { default: store } = require('./store');
const { default: history } = require('./history');
const { authHeader } = require('./auth-header');

module.exports = {
    store,
    history,
    authHeader
}