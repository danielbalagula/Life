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

var sanitize = buildSanitizeFunction(['body']);
var check = buildCheckFunction(['body']);

module.exports = [sanitize('category').customSanitizer(function (category) {
    return category.toLowerCase();
}), sanitize('datePurchased').customSanitizer(function (datePurchased) {
    return Math.floor(datePurchased / (1000 * 3600));
}), check('datePurchased').optional().toFloat().isFloat().withMessage('Date should be in milliseconds (i.e. Date.now())').custom(function (datePurchased) {
    var currentHour = new Date().getTime() / (1000 * 3600);
    return currentHour >= datePurchased;
}).withMessage('Purchase date can\'t be greater than current date').custom(function (datePurchased) {
    var currentHour = new Date().getTime() / (1000 * 3600);
    return currentHour <= datePurchased + 31622400 / 3600;
}).withMessage('Purchase date must be within one year of current date'), check('name').exists().withMessage('Name of purchase required').isString('Name should be a string').isAscii().withMessage('Name should be Ascii').trim().isLength({ min: 3, max: 16 }).withMessage('Name should be 3 to 16 characters'), check('category').exists().withMessage('Category of purchase required').isString('Category should be a string').isAscii().withMessage('Establishment should be Ascii').trim().isIn(_categories2.default).withMessage('Category should be one of' + _categories2.default.map(function (category) {
    return ' ' + category.charAt(0).toUpperCase() + category.slice(1);
})), check('establishment').exists().withMessage('Establishment of purchase required').isString('Establishment should be a string').isAscii().withMessage('Establishment should be Ascii').trim().isLength({ min: 3, max: 16 }).withMessage('Establishment should be 3 to 16 characters'), check('cost').exists().withMessage('Cost of purchased required').toFloat().isFloat().withMessage('Cost needs to be numeric'), sanitize('cost', function (cost) {
    return cost.toFixed(2);
}), check('luxury').optional().toBoolean().isBoolean().withMessage('Luxury should be either true or false'), check('subscription').optional().toInt().isInt({ min: 1, max: 365 }).withMessage('Subscription of purchase should indicate every \'X\' days it repeats between 1 and 365'), function (req, res, next) {
    var results = validationResult(req).formatWith(_expressValidator2.default);
    if (!results.isEmpty()) {
        res.status(422);
        next(results.array());
    }
    next();
}];
//# sourceMappingURL=../src/middleware/purchase.post.validation.js.map
