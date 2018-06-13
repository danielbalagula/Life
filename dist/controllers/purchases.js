'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _awaitToJs = require('await-to-js');

var _awaitToJs2 = _interopRequireDefault(_awaitToJs);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _Purchase = require('../models/purchase/Purchase');

var _Purchase2 = _interopRequireDefault(_Purchase);

var _User = require('../models/users/User');

var _User2 = _interopRequireDefault(_User);

var _passport = require('../config/passport');

var _purchasePost = require('../middleware/purchase.post.validation');

var _purchasePost2 = _interopRequireDefault(_purchasePost);

var _purchaseGet = require('../middleware/purchase.get.validation');

var _purchaseGet2 = _interopRequireDefault(_purchaseGet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var purchasesRouter = _express2.default.Router();

var purchasesLogger = (0, _debug2.default)('purchases_');

purchasesRouter.get('/', _passport.isAuthenticated, _purchaseGet2.default, function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
        var _req$query, startDate, endDate, params, query, _ref2, _ref3, findErr, result;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _req$query = req.query, startDate = _req$query.startDate, endDate = _req$query.endDate, params = (0, _objectWithoutProperties3.default)(_req$query, ['startDate', 'endDate']);
                        query = (0, _extends3.default)({}, params, {
                            datePurchased: {
                                $gte: startDate || 0,
                                $lt: endDate || new Date().getTime() / (1000 * 3600)
                            }
                        }, {
                            '_id': { $in: req.user.purchases }
                        });
                        _context.next = 4;
                        return (0, _awaitToJs2.default)(_Purchase2.default.find(query));

                    case 4:
                        _ref2 = _context.sent;
                        _ref3 = (0, _slicedToArray3.default)(_ref2, 2);
                        findErr = _ref3[0];
                        result = _ref3[1];


                        if (findErr) {
                            res.status(500);
                            next('Internal server error retrieving purchase(s)');
                        }
                        purchasesLogger('[' + req.id + '] ' + req.user.email + ' retrieved ' + result.length + ' products');
                        res.status(200).send(result);

                    case 11:
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

purchasesRouter.post('/', _passport.isAuthenticated, _purchasePost2.default, function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, next) {
        var newPurchaseId, newPurchase;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        newPurchaseId = _shortid2.default.generate();
                        newPurchase = new _Purchase2.default((0, _extends3.default)({}, req.body, {
                            _id: newPurchaseId
                        }));


                        _promise2.default.all([newPurchase.save(), _User2.default.findOneAndUpdate({ _id: req.user.id }, {
                            $addToSet: {
                                purchases: newPurchaseId
                            }
                        })]).then(function (_ref5) {
                            var _ref6 = (0, _slicedToArray3.default)(_ref5, 2),
                                savedPurchase = _ref6[0],
                                updatedUser = _ref6[1];

                            purchasesLogger('[' + req.id + '] ' + updatedUser.email + ' added product with id ' + savedPurchase._id);
                            res.status(201).send('Added product for ' + req.user.email);
                        }).catch(function (err) {
                            next(err);
                            _Purchase2.default.deleteOne({ _id: newPurchaseId });
                        });

                    case 3:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x4, _x5, _x6) {
        return _ref4.apply(this, arguments);
    };
}());

module.exports = purchasesRouter;
//# sourceMappingURL=../src/controllers/purchases.js.map
