import mongoose   from 'mongoose';
import bcrypt     from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    purchases: [{ type: Schema.Types.ObjectId, ref: 'Purchase' }]
});

userSchema.statics.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.isValidPassword = async function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);