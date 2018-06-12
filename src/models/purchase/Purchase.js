import mongoose   from 'mongoose';
import shortid    from 'shortid';
import categories from './categories';

const { Schema } = mongoose;

const purchaseSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate(),
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String, 
        required: true,
        enum: categories,
    },
    luxury: {
        type: Boolean,
        required: true,
        default: false
    },
    date_purchased: {
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
    }]
});

module.exports = mongoose.model('Purchase', purchaseSchema);