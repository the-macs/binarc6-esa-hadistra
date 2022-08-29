const mongoose = require('mongoose')

const UserHistorySchema = mongoose.Schema({
    user: {
        type: Object,
        required: true
    },
    userChoice: {
        type: String,
        required: true
    },
    comChoice: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
}, { versionKey: false })

const UserHistory = mongoose.model('UserHistory', UserHistorySchema)

module.exports = UserHistory