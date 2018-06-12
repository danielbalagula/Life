import validator  from 'express-validator/check';
import sanitizer  from 'express-validator/filter';
import categories from './../models/purchase/categories';
import formatter  from './errorFormatter';

const { buildCheckFunction, validationResult }  = validator;
const { buildSanitizeFunction }                 = sanitizer;
const sanitize                                  = buildSanitizeFunction(['query']);
const check                                     = buildCheckFunction(['query']);

module.exports = [
    sanitize('category')
        .customSanitizer(category => {
            return category.toLowerCase();
        }),
    sanitize('start_date')
        .customSanitizer(start_date => {
            return Math.floor( Math.max(0, start_date / (1000 * 3600)) );
        }),
    sanitize('end_date')
        .customSanitizer(end_date => {
            let currentHour = new Date().getTime() / (1000 * 3600);
            return Math.floor( Math.min(currentHour, end_date / (1000 * 3600)) );
        }),
    check('start_date')
        .optional()
        .toFloat()
        .isFloat().withMessage('Start date should be positive in milliseconds (i.e. Date.now())')
        .custom(start_date => {
            let currentHour = new Date().getTime() / (1000 * 3600);
            return currentHour >= start_date;
        }).withMessage('Start date can\'t be greater than current date'),
    check('end_date')
        .optional()
        .toFloat()
        .isFloat({min: 0}).withMessage('End date should be positive in milliseconds (i.e. Date.now())')
        .custom(end_date => {
            let currentHour = new Date().getTime() / (1000 * 3600);
            return currentHour >= end_date;
        }).withMessage('End date can\'t be greater than current date'),
    check('name')
        .optional()
        .isString('Name should be a string')
        .isAscii().withMessage('Name should be Ascii')
        .trim()
        .isLength({min: 3, max: 16}).withMessage('Name should be 3 to 16 characters'),
    check('category')
        .optional()
        .isString('Category should be a string')
        .isAscii().withMessage('Establishment should be Ascii')
        .trim()
        .isIn(categories).withMessage(`Category should be one of${categories.map(category => ' ' + category.charAt(0).toUpperCase() + category.slice(1))}`),
    check('establishment')
        .optional()
        .isString('Establishment should be a string')
        .isAscii().withMessage('Establishment should be Ascii')
        .trim()
        .isLength({min: 3, max: 16}).withMessage('Establishment should be 3 to 16 characters'),
    check('cost')
        .optional()
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
            next(results.array());
        }
        next();
    },
];