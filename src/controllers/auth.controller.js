const bcrypt = require('bcrypt')

const User = require('./../models/user.model')

const { generateToken } = require('../utils/jtwToken.utils')

module.exports = {
    auth: async (req, res) => {
        const { username, password } = req.body

        const user = await User.getUserByUsername(username, {
            withPassword: true
        })

        if (user.is_active) {
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
        } else {
            req.flash('msgType', 'danger')
            req.flash('msg', 'Username not active')
            res.redirect('/login')
        }

    },
    logout: (req, res) => {
        delete req.header.authorization

        req.session.destroy()
        res.redirect('/')
    },
}