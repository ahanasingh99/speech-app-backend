const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecordingSchema = new Schema({
    attemptedDate: String,
    userId: String,
    recordingUrl: String,
    feedback: String,
    transcriptionName: String,
    moduleName: String,
    activityName: String
})

module.exports = mongoose.model('Recording', RecordingSchema);