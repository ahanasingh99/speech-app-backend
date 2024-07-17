const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
    title: String,
    lessonSummary: String,
    video: String,
    encryptedId: String
})

module.exports = mongoose.model('Module', ModuleSchema);