const bcrypt = require('bcrypt')

const User = require('./../../models/user.model')

const { responseSuccess, responseError } = require('../../utils/responseFormatter.utils')

module.exports = {
    index: async (req, res) => {
        if (Object.keys(req.body) == 0) {
            try {
                const users = await User.getUser()

                res.status(200).json(responseSuccess(users))
            } catch (err) {
                res.status(500).json(responseError(err.message || "Error occured while getting users"))
            }
        } else {
            try {
                const { id } = req.body

                const user = await User.getUserById(id)

                if (!user) {
                    res.status(404).json(responseError("User not found"))
                } else {
                    res.status(200).json(responseSuccess(user))
                }
            } catch (err) {
                res.status(500).json(responseError(err.message || "Error occured while getting users"))
            }
        }
    },
    store: async (req, res) => {
        if (!req.body) res.status(400).json(responseError("Missing Body"))

        const { name, username, role, password, passwordConfirmation } = req.body

        const userRegistered = await User.getUserByUsername(username)

        if (userRegistered) {
            res.status(400).json(responseError("Username already exist"))
        } else {
            if (password !== passwordConfirmation) {
                res.status(400).json(responseError("Password is doesn't match"))
            } else {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)

                try {
                    const user = await User.storeUser({
                        name,
                        username,
                        role,
                        password: hashedPassword
                    })
                    res.status(200).json(responseSuccess(user, "User stored successfully"))
                } catch (err) {
                    res.status(500).send(responseError(err || "Error occured while creating user"))
                }
            }
        }
    },
    update: async (req, res) => {
        const { id, name, role, password, passwordConfirmation } = req.body

        const user = await User.getUserById(id)

        let hashedPassword = user.password

        if (password != '') {
            const salt = await bcrypt.genSalt(10)
            hashedPassword = await bcrypt.hash(password, salt)
        }

        if (password !== passwordConfirmation) {
            res.status(400).json(responseError("Password doesn't match Confirmation"))
        } else {
            try {
                const user = await User.updateUser(id, {
                    name,
                    role,
                    password: hashedPassword
                })

                res.status(200).json(responseSuccess(user, "User updated successfully"))
            } catch (err) {
                console.error(err)
                res.status(500).json(responseError("Error occured while updating user"))
            }
        }
    },
    delete: async (req, res) => {
        const { id } = req.body

        const user = await User.getUserById(id)

        if (user) {
            try {
                const user = await User.deleteUser(id)

                res.status(200).json(responseSuccess(user, "User deleted successfully"))
            } catch (err) {
                res.status(500).json(responseError(err || "Error occured while deleting user"))
            }
        } else {
            res.status(404).json(responseError('User not found'))
        }
    }
}