'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;


var userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    purchases: [{ type: String, ref: 'Purchase' }]
});

userSchema.statics.generateHash = function (password) {
    return _bcrypt2.default.hashSync(password, _bcrypt2.default.genSaltSync(8));
};

userSchema.methods.isValidPassword = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(password) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        return _context.abrupt('return', _bcrypt2.default.compareSync(password, undefined.password));

                    case 1:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}();

module.exports = _mongoose2.default.model('User', userSchema);
//# sourceMappingURL=../../src/models/users/User.js.map
