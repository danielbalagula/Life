'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _awaitToJs = require('await-to-js');

var _awaitToJs2 = _interopRequireDefault(_awaitToJs);

var _User = require('../models/users/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStrategy = _passportLocal2.default.Strategy;
var authLogger = (0, _debug2.default)('auth_');

_passport2.default.serializeUser(function (user, done) {
    done(null, user.id);
});

_passport2.default.deserializeUser(function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(id, done) {
        var _ref2, _ref3, err, user;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return (0, _awaitToJs2.default)(_User2.default.findById(id));

                    case 2:
                        _ref2 = _context.sent;
                        _ref3 = (0, _slicedToArray3.default)(_ref2, 2);
                        err = _ref3[0];
                        user = _ref3[1];

                        delete user.password;
                        done(err, user);

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

_passport2.default.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(email, password, done) {
        var _ref5, _ref6, findErr, user, _ref7, _ref8, validPassErr, isMatch;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return (0, _awaitToJs2.default)(_User2.default.findOne({ email: email.toLowerCase() }));

                    case 2:
                        _ref5 = _context2.sent;
                        _ref6 = (0, _slicedToArray3.default)(_ref5, 2);
                        findErr = _ref6[0];
                        user = _ref6[1];

                        if (!findErr) {
                            _context2.next = 8;
                            break;
                        }

                        return _context2.abrupt('return', done(findErr));

                    case 8:
                        if (user) {
                            _context2.next = 10;
                            break;
                        }

                        return _context2.abrupt('return', done(null, false, { msg: 'Email ' + email + ' not found' }));

                    case 10:
                        _context2.next = 12;
                        return (0, _awaitToJs2.default)(user.isValidPassword(password));

                    case 12:
                        _ref7 = _context2.sent;
                        _ref8 = (0, _slicedToArray3.default)(_ref7, 2);
                        validPassErr = _ref8[0];
                        isMatch = _ref8[1];

                        if (!validPassErr) {
                            _context2.next = 18;
                            break;
                        }

                        return _context2.abrupt('return', done(validPassErr));

                    case 18:
                        if (!isMatch) {
                            _context2.next = 20;
                            break;
                        }

                        return _context2.abrupt('return', done(null, user));

                    case 20:
                        return _context2.abrupt('return', done(null, false, { msg: 'Invalid e-mail or password' }));

                    case 21:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4, _x5) {
        return _ref4.apply(this, arguments);
    };
}()));

exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        authLogger('[' + req.id + '] ' + req.user.email + ' is authenticated');
        return next();
    }
    res.status(401);
    return next('Must be logged in');
};
//# sourceMappingURL=../src/config/passport.js.map
