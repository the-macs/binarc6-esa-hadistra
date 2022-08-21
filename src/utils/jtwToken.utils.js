const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

// const dataUsers = users.getUsers()

module.exports = {
    generateToken: async (_id) => {
        const user = await User.findOne({ _id: _id })

        const token = jwt.sign(
            {
                _id: user.id,
                name: user.name,
                role: user.role,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '24h'
            }
        )

        return token;
    },
    getUserVerified: (token) => {
        if (token) {
            try {
                verify = jwt.verify(token, process.env.JWT_SECRET)
                return verify
            } catch (err) {
                return false
            }
        }

        return false

    }
}
