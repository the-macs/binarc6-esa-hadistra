const express = require('express')
const router = express.Router()

// FE
const userRoute = require('./user.route')
const commonRoute = require('./common.route')
const apiUserRoute = require('./api/user.route')
const apiUserHistoryRoute = require('./api/userHistory.route')

// Admin Routes
const dashboardUserRoute = require('./dashboard/user.route')

router.use(userRoute)
router.use(commonRoute)

// // Daashboard routes
router.use('/dashboard', dashboardUserRoute)

// API routes
router.use('/api', apiUserRoute)
router.use('/api', apiUserHistoryRoute)

module.exports = router