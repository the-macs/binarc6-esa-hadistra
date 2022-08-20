const { getUserVerified } = require('./../utils/jtwToken.utils')

module.exports = {
    isGuest: (req, res, next) => {
        const token = req.header.authorization
        const verify = getUserVerified(token)

        if (!verify) next()
        else res.redirect('/')
    },
    isAuthenticated: (req, res, next) => {
        const token = req.header.authorization
        const verify = getUserVerified(token)

        if (verify) {
            req.user = verify
            next()
        } else {
            res.redirect('/login')
        }
    }
}