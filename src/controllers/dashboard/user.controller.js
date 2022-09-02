const bcrypt = require('bcrypt')
const User = require('./../../models/user.model')

module.exports = {
    index: async (req, res) => {
        try {
            const users = await User.getUser()

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

        const userRegistered = await User.getUserByUsername(username)

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
                    await User.storeUser({
                        name,
                        username,
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
        const user = await User.getUserById(req.params.id)

        res.render('dashboard/user/edit', {
            layout: 'layouts/_dashboard-layout',
            message: {
                msgType: req.flash('msgType'),
                msg: req.flash('msg')
            },
            user
        })
    },
    update: async (req, res) => {
        const { id, name, role, password, passwordConfirmation } = req.body

        const user = await User.getUserById(id, {
            withPassword: true
        })

        let hashedPassword = user.password

        if (password != '') {
            const salt = await bcrypt.genSalt(10)
            hashedPassword = await bcrypt.hash(password, salt)
        }

        if (password !== passwordConfirmation) {
            req.flash('msgType', 'danger')
            req.flash('msg', 'Password is doesn\'t match')
            res.redirect(`/dashboard/user/edit/${id}`)
        } else {
            try {
                await User.updateUser(id, {
                    name,
                    role,
                    password: hashedPassword
                })

                req.flash('msgType', 'success')
                req.flash('msg', 'User has been updated Successfully')
                res.redirect(`/dashboard/user`)
            } catch (err) {
                console.error(err)
                req.flash('msgType', 'danger')
                req.flash('msg', 'Error occured while updating user')
                res.redirect(`/dashboard/user/edit/${id}`)
            }
        }
    },
    delete: async (req, res) => {
        const { id } = req.body

        const user = await User.getUserById(id)

        if (user) {
            try {
                await User.deleteUser(id)

                req.flash('msgType', 'success')
                req.flash('msg', 'Delete User Success')
            } catch (err) {
                req.flash('msgType', 'danger')
                req.flash('msg', 'Error occured while deleting user')
            }
        } else {
            req.flash('msgType', 'danger')
            req.flash('msg', 'User not found')
        }

        res.redirect('/dashboard/user')
    }
}