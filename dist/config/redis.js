'use strict';

var _connectRedis = require('connect-redis');

var _connectRedis2 = _interopRequireDefault(_connectRedis);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

require('./env');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var redisLogger = (0, _debug2.default)('redis_');

var RedisStore = (0, _connectRedis2.default)(_expressSession2.default);
var client = _redis2.default.createClient({
    url: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
});

client.on('ready', function () {
    redisLogger(_chalk2.default.bgBlue('Redis connection open to ' + process.env.REDIS_URL));
});

client.on('error', function (err) {
    redisLogger(_chalk2.default.bgYellow('Redis connection encountered error: ' + err));
});

client.on('end', function () {
    redisLogger(_chalk2.default.bgYellow('Redis connection disconnected'));
});

process.on('SIGINT', function () {
    client.quit();
    redisLogger(_chalk2.default.bgRed('Redis connection closed due to application termination'));
});

module.exports = (0, _expressSession2.default)({
    store: new RedisStore({
        client: client
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
});
//# sourceMappingURL=../src/config/redis.js.map
