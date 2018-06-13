'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _expressFlash = require('express-flash');

var _expressFlash2 = _interopRequireDefault(_expressFlash);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _purchases = require('./controllers/purchases');

var _purchases2 = _interopRequireDefault(_purchases);

var _users = require('./controllers/users');

var _users2 = _interopRequireDefault(_users);

require('./config/db');

require('./config/passport');

var _redis = require('./config/redis');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var httpLogger = (0, _debug2.default)('http_');
var errorLogger = (0, _debug2.default)('error_');
httpLogger('Starting application on port ' + (process.env.PORT || 3000));

app.set('views', _path2.default.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));
app.use(_bodyParser2.default.urlencoded({ extended: false }));

app.use(_redis2.default);
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
app.use((0, _expressFlash2.default)());

app.use(function (req, res, next) {
    req.id = _shortid2.default.generate();
    httpLogger('[' + req.id + '] ' + req.method + ' ' + req.path);
    next();
});

app.use('/purchases', _purchases2.default);
app.post('/register', _users2.default);
app.post('/login', _users2.default);
app.get('/logout', _users2.default);

app.use(function (err, req, res) {
    errorLogger(_chalk2.default.white('[' + req.id + ']'), _chalk2.default.red(err));
    res.send(err);
});

app.get('/', function (req, res) {
    res.send('hi');
});

app.listen(process.env.PORT || 3000);

module.exports = app;
//# sourceMappingURL=src/app.js.map
