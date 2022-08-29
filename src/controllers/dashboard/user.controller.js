const bcrypt = require('bcrypt')

const User = require('./../../models/user.model')
const UserHistory = require('./../../models/userHistory.model')
const UserBiodata = require('./../../models/userBiodata.model')

module.exports = {
    index: async (req, res) => {
        try {
            const users = await User.find()

            res.render('dashboard/user/index', {
                layout: 'layouts/_dashboard-layout',
                users: users,
                user: req.user,
                message: {
                    msgType: req.flash('msgType'),
                    msg: req.flash('msg')
                }
            })
        } catch (err) {
            res.send(err.message)
        }
    },
    create: async (req, res) => {
        res.render('dashboard/user/create', {
            layout: 'layouts/_dashboard-layout',
        })
    },
    store: async (req, res) => {
        const { username, name, role, password, passwordConfirmation } = req.body

        const userRegistered = await User.findOne({ username: username })

        if (userRegistered) {
            req.flash('msgType', 'danger')
            req.flash('msg', 'Username already exist')
            res.redirect('/dashboard/user')
        } else {
            if (password !== passwordConfirmation) {
                req.flash('msgType', 'danger')
                req.flash('msg', 'Password is doesn\'t match')
                res.redirect('/dashboard/user')
            } else {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)

                try {
                    await User.insertMany({
                        username,
                        name,
                        role,
                        password: hashedPassword
                    })

                    req.flash('msgType', 'success')
                    req.flash('msg', 'Add new user success')
                    res.redirect('/dashboard/user')
                } catch (err) {
                    req.flash('msgType', 'danger')
                    req.flash('msg', 'Error occured while creating user')
                    res.redirect('/dashboard/user')
                }
            }
        }
    },
    edit: async (req, res) => {
        const user = await User.findById(req.params.id)

        res.render('dashboard/user/edit', {
            layout: 'layouts/_dashboard-layout',
            user
        })
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
            req.flash('msgType', 'danger')
            req.flash('msg', 'Password is doesn\'t match')
            res.redirect(`/dashboard/user/edit/${_id}`)
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
                    req.flash('msgType', 'success')
                    req.flash('msg', 'User has been updated Successfully')
                    res.redirect(`/dashboard/user`)
                }).catch(err => {
                    req.flash('msgType', 'danger')
                    req.flash('msg', 'Error occured while updating user')
                    res.redirect(`/dashboard/user/edit/${_id}`)
                })
            } catch (err) {
                req.flash('msgType', 'danger')
                req.flash('msg', 'Error occured while updating user')
                res.redirect(`/dashboard/user/edit/${_id}`)
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
                        req.flash('msgType', 'success')
                        req.flash('msg', 'Delete User Success')
                    })
                    .catch((err) => {
                        req.flash('msgType', 'danger')
                        req.flash('msg', 'Error occured while deleting user')
                    })
            } catch (err) {
                req.flash('msgType', 'danger')
                req.flash('msg', 'Error occured while deleting user')
            }
        } else {
            req.flash('msgType', 'danger')
            req.flash('msg', 'User not found')
        }

        res.redirect('/dashboard/user')
    },
    getHistory: async (req, res) => {
        const _id = req.params.id

        try {
            const userHistory = await UserHistory.find({ "user._id": _id })
            const selectedUser = await User.findOne({ _id })
            res.render('dashboard/user/history', {
                layout: 'layouts/_dashboard-layout',
                user: req.user,
                selectedUser: selectedUser,
                userHistory: userHistory
            })
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    },
    updateBiodata: async (req, res) => {
        const { userId, email, birthplace, birthdate, gender, nationality, phone } = req.body

        const user = await User.findOne({ _id: userId })

        const insertUser = {
            _id: userId,
            name: user.name,
            username: user.username,
            role: user.role
        }
        console.log(userId)

        try {
            const query = { 'user._id': userId }

            const update = {
                $set: {
                    user: insertUser,
                    email,
                    birthplace,
                    birthdate,
                    gender,
                    nationality,
                    phone
                }
            }

            const options = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }

            await UserBiodata.findOneAndUpdate(query, update, options)
                .then((user) => {
                    req.flash('msgType', 'success')
                    req.flash('msg', 'Biodata has been updated Successfully')
                    res.redirect(`/dashboard/user-biodata/${userId}`)
                }).catch(err => {
                    console.log(err)
                    req.flash('msgType', 'danger')
                    req.flash('msg', 'Error occured while updating biodata')
                    res.redirect(`/dashboard/user-biodata/${userId}`)
                })
        } catch (err) {
            req.flash('msgType', 'danger')
            req.flash('msg', 'Error occured while updating biodata')
            console.log(err)
            res.redirect(`/dashboard/user-biodata/${userId}`)
        }
    },
    getBiodata: async (req, res) => {
        const _id = req.params.id

        try {
            const userBiodata = await UserBiodata.findOne({ "user._id": _id })
            const selectedUser = await User.findOne({ _id })


            console.log(userBiodata)
            res.render('dashboard/user/biodata', {
                layout: 'layouts/_dashboard-layout',
                user: req.user,
                selectedUser: selectedUser,
                userBiodata: userBiodata
            })
        } catch (err) {
            res.send(err)
        }
    }
}