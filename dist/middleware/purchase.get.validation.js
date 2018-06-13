'use strict';

var _check = require('express-validator/check');

var _check2 = _interopRequireDefault(_check);

var _filter = require('express-validator/filter');

var _filter2 = _interopRequireDefault(_filter);

var _categories = require('./../models/purchase/categories');

var _categories2 = _interopRequireDefault(_categories);

var _expressValidator = require('./express.validator.formatter');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildCheckFunction = _check2.default.buildCheckFunction,
    validationResult = _check2.default.validationResult;
var buildSanitizeFunction = _filter2.default.buildSanitizeFunction;

var sanitize = buildSanitizeFunction(['query']);
var check = buildCheckFunction(['query']);

module.exports = [sanitize('category').customSanitizer(function (category) {
    return category.toLowerCase();
}), sanitize('startDate').customSanitizer(function (startDate) {
    return Math.floor(Math.max(0, startDate / (1000 * 3600)));
}), sanitize('endDate').customSanitizer(function (endDate) {
    var currentHour = new Date().getTime() / (1000 * 3600);
    return Math.floor(Math.min(currentHour, endDate / (1000 * 3600)));
}), check('startDate').optional().toFloat().isFloat().withMessage('Start date should be positive in milliseconds (i.e. Date.now())').custom(function (startDate) {
    var currentHour = new Date().getTime() / (1000 * 3600);
    return currentHour >= startDate;
}).withMessage('Start date can\'t be greater than current date'), check('endDate').optional().toFloat().isFloat({ min: 0 }).withMessage('End date should be positive in milliseconds (i.e. Date.now())').custom(function (endDate) {
    var currentHour = new Date().getTime() / (1000 * 3600);
    return currentHour >= endDate;
}).withMessage('End date can\'t be greater than current date'), check('name').optional().isString('Name should be a string').isAscii().withMessage('Name should be Ascii').trim().isLength({ min: 3, max: 16 }).withMessage('Name should be 3 to 16 characters'), check('category').optional().isString('Category should be a string').isAscii().withMessage('Establishment should be Ascii').trim().isIn(_categories2.default).withMessage('Category should be one of' + _categories2.default.map(function (category) {
    return ' ' + category.charAt(0).toUpperCase() + category.slice(1);
})), check('establishment').optional().isString('Establishment should be a string').isAscii().withMessage('Establishment should be Ascii').trim().isLength({ min: 3, max: 16 }).withMessage('Establishment should be 3 to 16 characters'), check('cost').optional().toFloat().isFloat().withMessage('Cost needs to be numeric'), sanitize('cost', function (cost) {
    return cost.toFixed(2);
}), check('luxury').optional().toBoolean().isBoolean().withMessage('Luxury should be either true or false'), check('subscription').optional().toInt().isInt({ min: 1, max: 365 }).withMessage('Subscription of purchase should indicate every \'X\' days it repeats between 1 and 365'), function (req, res, next) {
    var results = validationResult(req).formatWith(_expressValidator2.default);
    if (!results.isEmpty()) {
        res.status(422);
        next(results.array());
    }
    next();
}];
//# sourceMappingURL=../src/middleware/purchase.get.validation.js.map
