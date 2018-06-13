'use strict';

var _check = require('express-validator/check');

var _check2 = _interopRequireDefault(_check);

var _filter = require('express-validator/filter');

var _filter2 = _interopRequireDefault(_filter);

var _expressValidator = require('./express.validator.formatter');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildCheckFunction = _check2.default.buildCheckFunction,
    validationResult = _check2.default.validationResult;
var buildSanitizeFunction = _filter2.default.buildSanitizeFunction;

var sanitize = buildSanitizeFunction(['body']);
var check = buildCheckFunction(['body']);

module.exports = [sanitize('email').customSanitizer(function (email) {
    return email.toLowerCase().trim();
}), check('email').exists().withMessage('Email required').isEmail().withMessage('Invalid e-mail'), check('password').exists().withMessage('Password required'), function (req, res, next) {
    var results = validationResult(req).formatWith(_expressValidator2.default);
    if (!results.isEmpty()) {
        res.status(422);
        next(results.array());
    }
    next();
}];
//# sourceMappingURL=../src/middleware/login.post.validation.js.map
