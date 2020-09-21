const { default: alertActions } = require('./alert.actions.js');
const { default: userActions } = require('./user.actions.js');
const { default: settingAction } = require('./setting.actions.js');
const { default: chartAction } = require('./chart.action.js')

module.exports = {
    alertActions,
    chartAction,
    userActions,
    settingAction
}