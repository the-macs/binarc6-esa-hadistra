const mongoose = require('mongoose')

const UserHistory = mongoose.model('user_game_history', {
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
})

module.exports = UserHistory