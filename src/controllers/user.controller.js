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

        const userRegistered = await User.getUserByUsername(username)

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

                try {
                    await User.storeUser({ name, username, role: 'player', password: hashedPassword })

                    req.flash('msgType', 'success')
                    req.flash('msg', 'Register Successfully')

                    res.redirect('/login')
                } catch (error) {
                    req.flash('msgType', 'danger')
                    req.flash('msg', 'Register Failed')

                    res.redirect('/register')
                }
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
        const { id, name, password } = req.body

        const user = await User.getUserById(id, {
            withPassword: true
        })

        let newPassword = user.password

        let role = user.role

        if (password != '') {
            const salt = await bcrypt.genSalt(10)
            newPassword = await bcrypt.hash(password, salt)
        }

        await User.updateUser(id, {
            name,
            role,
            password: newPassword
        })

        const token = await generateToken(_id)

        req.header.authorization = token

        res.redirect('/')
    },
    deleteUser: async (req, res) => {
        const { id } = req.body

        await User.deleteUser(id).then(result => delete req.header.authorization)

        req.session.destroy()
        res.redirect('/')
    }
}