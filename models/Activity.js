const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    title: String,
    prompt: String,
    moduleId: String,
    encryptedId: String
})

module.exports = mongoose.model('Activity', ActivitySchema);