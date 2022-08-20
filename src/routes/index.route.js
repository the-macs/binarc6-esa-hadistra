const express = require('express')
const router = express.Router()

const userRoute = require('./user.route')
const commonRoute = require('./common.route')
const apiUserRoute = require('./api/user.route')

router.use(userRoute)
router.use(commonRoute)
router.use(apiUserRoute)

module.exports = router