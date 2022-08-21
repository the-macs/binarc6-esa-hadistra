const express = require('express')
const router = express.Router()

const { getUserVerified } = require('./../../utils/jtwToken.utils')

const UserHistory = require('./../../models/userHistory.model')

const authMiddleware = require('./../../middlewares/auth.middleware')

router.use(authMiddleware.isAuthenticatedWithAdmin)

router.route('/user-history')
    .post(async (req, res) => {
        const { userChoice, comChoice, result, timestamp } = req.body

        const token = req.header.authorization
        const verify = getUserVerified(token)

        if (!verify) return res.status(401).json({ message: "User Unverified" })

        if (!req.body) res.status(400).json({ message: "Missing parameters" })

        try {
            await UserHistory.insertMany({
                user: verify,
                userChoice,
                comChoice,
                timestamp,
                result
            })

            res.status(201).json({ message: "History successfully insert" })
        } catch (err) {
            res.status(500).json({ message: "Error insert history" })
        }
    })

module.exports = router