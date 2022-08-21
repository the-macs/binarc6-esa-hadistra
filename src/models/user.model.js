const mongoose = require('mongoose')

const User = mongoose.model('user_game', {
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'player' // player && admin
    },
    password: {
        type: String,
        required: true
    },
})

module.exports = User