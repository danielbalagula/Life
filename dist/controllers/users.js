'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _awaitToJs = require('await-to-js');

var _awaitToJs2 = _interopRequireDefault(_awaitToJs);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _User = require('../models/users/User');

var _User2 = _interopRequireDefault(_User);

var _loginPost = require('../middleware/login.post.validation');

var _loginPost2 = _interopRequireDefault(_loginPost);

var _registerPost = require('../middleware/register.post.validation');

var _registerPost2 = _interopRequireDefault(_registerPost);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var usersLogger = (0, _debug2.default)('users_');

var usersRouter = _express2.default.Router();

usersRouter.post('/register', _registerPost2.default, function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
        var newUser, _ref2, _ref3, findErr, existingUser, _ref4, _ref5, saveErr, savedUser;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!req.user) {
                            _context.next = 3;
                            break;
                        }

                        res.status(400);
                        return _context.abrupt('return', next('Already logged in'));

                    case 3:
                        newUser = new _User2.default({
                            email: req.body.email,
                            password: _User2.default.generateHash(req.body.password)
                        });
                        _context.next = 6;
                        return (0, _awaitToJs2.default)(_User2.default.findOne({ email: req.body.email }));

                    case 6:
                        _ref2 = _context.sent;
                        _ref3 = (0, _slicedToArray3.default)(_ref2, 2);
                        findErr = _ref3[0];
                        existingUser = _ref3[1];

                        if (!findErr) {
                            _context.next = 12;
                            break;
                        }

                        return _context.abrupt('return', next(findErr));

                    case 12:
                        if (!existingUser) {
                            _context.next = 15;
                            break;
                        }

                        res.status(409);
                        return _context.abrupt('return', next('Username already taken'));

                    case 15:
                        _context.next = 17;
                        return (0, _awaitToJs2.default)(newUser.save());

                    case 17:
                        _ref4 = _context.sent;
                        _ref5 = (0, _slicedToArray3.default)(_ref4, 2);
                        saveErr = _ref5[0];
                        savedUser = _ref5[1];

                        if (!saveErr) {
                            _context.next = 23;
                            break;
                        }

                        return _context.abrupt('return', next(saveErr));

                    case 23:

                        req.logIn(savedUser, function (loginErr) {
                            if (loginErr) return next(loginErr);
                            usersLogger('[' + req.id + '] ' + savedUser.email + ' successfully registered');
                            return res.status(201).send('Successfully registered');
                        });

                    case 24:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}());

usersRouter.post('/login', _loginPost2.default, function (req, res, next) {
    if (req.user) {
        res.status(400);
        return next('Already logged in');
    }
    _passport2.default.authenticate('local', function (authErr, user, info) {
        if (authErr) return next(authErr);
        if (!user) return res.send(info);

        req.logIn(user, function (loginErr) {
            if (loginErr) return next(loginErr);
            usersLogger('[' + req.id + '] ' + user.email + ' successfully logged in');
            return res.send(user);
        });
    })(req, res, next);
});

usersRouter.get('/logout', function (req, res, next) {
    if (!req.user) {
        res.status(422);
        return next('Not logged in');
    }
    var user = req.user;
    req.logout();
    req.session.destroy(function (err) {
        if (err) usersLogger('Error destroying ' + user.email + '\'s session: ' + err);
        usersLogger('[' + req.id + '] ' + user.email + ' successfully logged out');
        req.user = null;
        return res.status(200).send('Successfully logged out');
    });
});

module.exports = usersRouter;
//# sourceMappingURL=../src/controllers/users.js.map
