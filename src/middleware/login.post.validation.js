import validator  from 'express-validator/check';
import sanitizer  from 'express-validator/filter';
import formatter  from './errorFormatter';

const { buildCheckFunction, validationResult }  = validator;
const { buildSanitizeFunction }                 = sanitizer;
const sanitize                                  = buildSanitizeFunction(['body']);
const check                                     = buildCheckFunction(['body']);

module.exports = [
    sanitize('email')
        .customSanitizer(email => {
            return email.toLowerCase().trim();
        }),
    check('email')
        .exists().withMessage('Email required')
        .isEmail().withMessage('Invalid e-mail'),
    check('password')
        .exists().withMessage('Password required'),
    (req, res, next) => {
        const results = validationResult(req).formatWith(formatter);
        if (!results.isEmpty()) {
            res.status(422);
            next(results.array())
        }
        next();
    }
];