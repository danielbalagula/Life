'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

require('./env');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongooseLogger = (0, _debug2.default)('mongoose_');

var options = { keepAlive: 1 };
var dbConnection = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_URL + '/' + process.env.DB_NAME;

_mongoose2.default.connect(dbConnection, options);

_mongoose2.default.connection.on('connected', function () {
    mongooseLogger(_chalk2.default.bgBlue('Mongoose connection open to ' + process.env.DB_URL));
});

_mongoose2.default.connection.on('error', function (err) {
    mongooseLogger(_chalk2.default.bgRed('Mongoose connection encountered error: ' + err));
});

_mongoose2.default.connection.on('disconnected', function () {
    mongooseLogger(_chalk2.default.bgYellow('Mongoose connection disconnected'));
});

process.on('SIGINT', function () {
    _mongoose2.default.connection.close(function () {
        mongooseLogger(_chalk2.default.bgRed('Mongoose connection closed due to application termination'));
    });
});
//# sourceMappingURL=../src/config/db.js.map
