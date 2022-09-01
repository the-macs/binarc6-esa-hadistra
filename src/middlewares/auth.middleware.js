const { getUserVerified } = require('./../utils/jtwToken.utils')

const { responseError } = require('./../utils/responseFormatter.utils')

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
    },
    apiIsAuthenticatedWithAdmin: (req, res, next) => {
        const token = req.header.authorization
        const verify = getUserVerified(token)

        if (verify && verify.role === 'admin') {
            req.user = verify
            next()
        } else {
            res.status(403).json(responseError('User not authenticated'))
        }
    },
    isAuthenticatedWithAdmin: (req, res, next) => {
        const token = req.header.authorization
        const verify = getUserVerified(token)

        if (verify && verify.role === 'admin') {
            req.user = verify
            next()
        } else {
            res.redirect('/login')
        }
    },
}