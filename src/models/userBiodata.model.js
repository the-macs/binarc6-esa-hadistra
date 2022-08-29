const mongoose = require('mongoose')

const UserBiodataSchema = mongoose.Schema({
    user: {
        type: Object,
        required: true
    },
    birthplace: {
        type: String,
        required: true
    },
    birthdate: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
}, { versionKey: false })

const UserBiodata = mongoose.model('UserBiodata', UserBiodataSchema)

module.exports = UserBiodata