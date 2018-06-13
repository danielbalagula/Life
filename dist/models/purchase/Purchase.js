'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _categories = require('./categories');

var _categories2 = _interopRequireDefault(_categories);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;


var purchaseSchema = new Schema({
    _id: {
        type: String,
        default: _shortid2.default.generate(),
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: _categories2.default
    },
    luxury: {
        type: Boolean,
        required: true,
        default: false
    },
    datePurchased: {
        type: Number,
        required: true,
        default: Math.floor(Date.now() / (1000 * 3600))
    },
    establishment: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    subscription: {
        type: Number,
        required: true,
        default: false
    },
    alternatives: [{
        name: String,
        cost: Number
    }],
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = _mongoose2.default.model('Purchase', purchaseSchema);
//# sourceMappingURL=../../src/models/purchase/Purchase.js.map
