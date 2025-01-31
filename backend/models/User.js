const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true},
    password : {type: String, require: true, mingLength:8}
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = { userModel };