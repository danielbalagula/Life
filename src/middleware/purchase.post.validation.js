import validator  from 'express-validator/check';
import sanitizer  from 'express-validator/filter';
import categories from './../models/purchase/categories';
import formatter  from './express.validator.formatter';

const { buildCheckFunction, validationResult }  = validator;
const { buildSanitizeFunction }                 = sanitizer;
const sanitize                                  = buildSanitizeFunction(['body']);
const check                                     = buildCheckFunction(['body']);

module.exports = [
    sanitize('category')
        .customSanitizer(category => {
            return category.toLowerCase();
        }),
    sanitize('datePurchased')
        .customSanitizer(datePurchased => {
            return Math.floor(datePurchased / (1000 * 3600));
        }),
    check('datePurchased')
        .optional()
        .toFloat()
        .isFloat().withMessage('Date should be in milliseconds (i.e. Date.now())')
        .custom(datePurchased => {
            let currentHour = new Date().getTime() / (1000 * 3600);
            return currentHour >= datePurchased;
        }).withMessage('Purchase date can\'t be greater than current date')
        .custom(datePurchased => {
            let currentHour = new Date().getTime() / (1000 * 3600);
            return currentHour <= datePurchased + (31622400 / 3600);
        }).withMessage('Purchase date must be within one year of current date'),
    check('name')
        .exists().withMessage('Name of purchase required')
        .isString('Name should be a string')
        .isAscii().withMessage('Name should be Ascii')
        .trim()
        .isLength({min: 3, max: 16}).withMessage('Name should be 3 to 16 characters'),
    check('category')
        .exists().withMessage('Category of purchase required')
        .isString('Category should be a string')
        .isAscii().withMessage('Establishment should be Ascii')
        .trim()
        .isIn(categories).withMessage(`Category should be one of${categories.map(category => ' ' + category.charAt(0).toUpperCase() + category.slice(1))}`),
    check('establishment')
        .exists().withMessage('Establishment of purchase required')
        .isString('Establishment should be a string')
        .isAscii().withMessage('Establishment should be Ascii')
        .trim()
        .isLength({min: 3, max: 16}).withMessage('Establishment should be 3 to 16 characters'),
    check('cost')
        .exists().withMessage('Cost of purchased required')
        .toFloat()
        .isFloat().withMessage('Cost needs to be numeric'),
    sanitize('cost', cost => {
        return cost.toFixed(2);
    }),
    check('luxury')
        .optional()
        .toBoolean()
        .isBoolean().withMessage('Luxury should be either true or false'),
    check('subscription')
        .optional()
        .toInt()
        .isInt({min: 1, max: 365}).withMessage('Subscription of purchase should indicate every \'X\' days it repeats between 1 and 365'),
    (req, res, next) => { 
        const results = validationResult(req).formatWith(formatter);
        if (!results.isEmpty()) {
            res.status(422);
            next(results.array())
        }
        next();
    }
];