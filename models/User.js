const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: String,
    email: String,
    completedModules: Array,
    completedQuizzes: Array,
    encryptedId: String
})



module.exports = mongoose.model('User', UserSchema);