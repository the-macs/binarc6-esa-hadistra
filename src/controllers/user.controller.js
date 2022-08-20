const bcrypt = require('bcrypt')
const users = require('./../models/users.model')

const dataUsers = users.getUsers()

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
        const dataInput = {
            username: req.body.username,
            password: req.body.password
        }

        const user = dataUsers.find((data) => data.username == dataInput.username)

        if (user) {
            const match = await bcrypt.compare(dataInput.password, user.password);
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

        const userRegistered = dataUsers.find((data) => data.username == username)

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

                users.storeUser(name, username, hashedPassword)

                req.flash('msgType', 'success')
                req.flash('msg', 'Register Successfully')

                res.redirect('/login')
            }
        }
    },
    updateUser: (req, res) => {
        const { _id, name, password } = req.body
        dataUsers.filter(async (user) => {
            if (user.id == _id) {
                user.id = _id
                user.name = name

                if (password != '') {
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(password, salt)
                    user.password = hashedPassword
                }

                req.user = user

                return user
            }
        })

        const token = generateToken(_id)

        req.header.authorization = token

        res.redirect('/')
    },
    setting: (req, res) => {
        res.render('setting', {
            layout: 'layouts/_main-layout',
            title: 'User Setting',
            user: req.user
        })
    },
    deleteUser: (req, res) => {
        const _id = req.body._id

        users.deleteUser(_id)

        delete req.header.authorization

        req.session.destroy()
        res.redirect('/')
    }
}