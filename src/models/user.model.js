const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
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
        required: true,
    },
}, { versionKey: false })

const User = mongoose.model('user_game', UserSchema);

module.exports = User