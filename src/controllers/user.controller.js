const bcrypt = require('bcrypt')
const User = require('../models/user.model')

const { generateToken } = require('../utils/jtwToken.utils')

module.exports = {
    login: (req, res) => {
        res.render('login', {
            layout: 'layouts/_main-layout',
            title: 'User Login',
            message: {
                msgType: req.flash('msgType'),
                msg: req.flash('msg')
            }
        })
    },
    auth: async (req, res) => {
        const { username, password } = req.body

        const user = await User.findOne({ username: username })

        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = await generateToken(user.id)

                req.header.authorization = token

                res.redirect('/')
            } else {
                req.flash('msgType', 'danger')
                req.flash('msg', 'Incorrect password')
                res.redirect('/login')
            }
        } else {
            req.flash('msgType', 'danger')
            req.flash('msg', 'Username not found')
            res.redirect('/login')
        }
    },
    logout: (req, res) => {
        delete req.header.authorization

        req.session.destroy()
        res.redirect('/')
    },
    signup: (req, res) => {
        res.render('signup', {
            layout: 'layouts/_main-layout',
            title: 'User Register',
            message: {
                msgType: req.flash('msgType'),
                msg: req.flash('msg')
            }
        })
    },
    register: async (req, res) => {
        const { name, username, password, password_confirmation } = req.body

        const userRegistered = await User.findOne({ username: username })

        if (userRegistered) {
            req.flash('msg', `Username already exist`)
            res.redirect('/sign-up')
        } else {
            if (password !== password_confirmation) {
                req.flash('msg', `Password doesn't match`)
                res.redirect('/sign-up')
            } else {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)

                await User.insertMany({ name, username, password: hashedPassword }, (error, result) => {
                    if (!error) {
                        req.flash('msgType', 'success')
                        req.flash('msg', 'Register Successfully')

                        res.redirect('/login')
                    } else {
                        req.flash('msgType', 'danger')
                        req.flash('msg', 'Register Failed')

                        res.redirect('/register')
                    }

                })
            }
        }
    },
    setting: (req, res) => {
        res.render('setting', {
            layout: 'layouts/_main-layout',
            title: 'User Setting',
            user: req.user
        })
    },
    updateUser: async (req, res) => {
        const { _id, name, password } = req.body

        const user = await User.findOne({ _id: _id })

        let newPassword = user.password

        if (password != '') {
            const salt = await bcrypt.genSalt(10)
            newPassword = await bcrypt.hash(password, salt)
        }

        await User.updateOne(
            { _id: _id },
            {
                $set: {
                    name: name,
                    password: newPassword,
                }
            }
        )

        const token = await generateToken(_id)

        req.header.authorization = token

        res.redirect('/')
    },
    deleteUser: async (req, res) => {
        const { _id } = req.body

        await User.deleteOne({ _id: _id }).then(result => delete req.header.authorization)

        req.session.destroy()
        res.redirect('/')
    }
}