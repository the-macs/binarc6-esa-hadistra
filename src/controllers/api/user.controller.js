const bcrypt = require('bcrypt')

const User = require('./../../models/user.model')

module.exports = {
    index: async (req, res) => {
        if (Object.keys(req.body) == 0) {
            try {
                const users = await User.find()
                res.json(users)
            } catch (err) {
                res.status(500).send({ message: err.message || "Error occured while getting users" })
            }
        } else {
            try {
                const { id } = req.body

                const user = await User.findById(id)

                if (!user) {
                    res.status(404).json({ error: 'User not found' })
                } else {
                    res.json(user)
                }
            } catch (err) {
                res.status(500).send({ message: err.message || "Error occured while getting users" })
            }
        }
    },
    store: async (req, res) => {
        if (!req.body) {
            res.status(400).json({ message: "Missing parameters" })
        }

        const { name, username, role, password, passwordConfirmation } = req.body

        const userRegistered = await User.findOne({ username: username })

        if (userRegistered) {
            res.status(500).send("Username already exist")
        } else {
            if (password !== passwordConfirmation) {
                res.status(400).json({ message: "Password is doesn't match" })
            } else {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)

                try {
                    const user = await User.insertMany({
                        name,
                        username,
                        role,
                        password: hashedPassword
                    })

                    res.status(200).json({ message: "Add new user success", user })
                } catch (err) {
                    res.status(500).send({ message: err || "Error occured while creating user" })
                }
            }
        }
    },
    update: async (req, res) => {
        const { _id, name, role, password, passwordConfirmation } = req.body

        const user = await User.findOne({ _id })

        let hashedPassword = user.password

        if (password != '') {
            const salt = await bcrypt.genSalt(10)
            hashedPassword = await bcrypt.hash(password, salt)
        }

        if (password !== passwordConfirmation) {
            res.status(400).json({ message: "Password is doesn't match" })
        } else {
            try {
                await User.findByIdAndUpdate(
                    _id,
                    {
                        $set: {
                            name,
                            role,
                            password: hashedPassword
                        }
                    },
                    { new: true }
                ).then((user) => {
                    res.status(200).json({ message: "Success", user })
                }).catch(err => {
                    res.status(500).json({ message: err || "Error occured while updating user" })
                })
            } catch (err) {
                res.status(500).json({ message: err || "Error occured while updating user" })
            }
        }
    },
    delete: async (req, res) => {
        const { _id } = req.body

        const user = await User.findById(_id)

        if (user) {
            try {
                await User.deleteOne({ _id: _id })
                    .then((result) => {
                        res.status(200).json({ message: "Delete User Success" })
                    })
                    .catch((err) => {
                        res.status(500).json({ message: err || "Error occured while deleting user" })
                    })
            } catch (err) {
                res.status(500).json({ message: err || "Error occured while deleting user" })
            }
        } else {
            res.status(404).json({ message: "User not found" })
        }
    }
}