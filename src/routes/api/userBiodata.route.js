const express = require('express')
const router = express.Router()

const { getUserVerified } = require('../../utils/jtwToken.utils')
const { responseSuccess, responseError } = require('../../utils/responseFormatter.utils')

const UserBiodata = require('../../models/userBiodata.model')

const authMiddleware = require('../../middlewares/auth.middleware')

// router.use(authMiddleware.apiIsAuthenticatedWithAdmin)

router.route('/user-biodata/:id')
    .get(async (req, res) => {
        const { id } = req.params


        // const token = req.header.authorization
        // const verify = getUserVerified(token)

        // if (!verify) return res.status(401).json({ message: "User Unverified" })

        try {
            const userBiodata = await UserBiodata.findOne({ "user._id": id })

            if (!userBiodata || userBiodata.length === 0) {
                return res.json(responseError(404, 'Data Not Found'))
            } else {
                res.status(200).json(responseSuccess(userBiodata))
            }
        } catch (err) {
            res.status(500).json({ message: err })
        }
    })

module.exports = router