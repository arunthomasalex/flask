const { default: userService } = require('./user.service');
const { default: settingService } = require('./setting.service');
const { default: chartService } = require('./chart.service');

module.exports = { userService, settingService, chartService };