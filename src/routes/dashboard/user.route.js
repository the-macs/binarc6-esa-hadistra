const express = require('express')
const router = express.Router()

const dashboardUserController = require('../../controllers/dashboard/user.controller')

const authMiddleware = require('./../../middlewares/auth.middleware')

router.use(authMiddleware.isAuthenticatedWithAdmin)

// Main Dashboard
router.get('/', (req, res) => res.redirect('/dashboard/user'))

// User
router.route('/user')
    .get(dashboardUserController.index)
    .post(dashboardUserController.store)
    .put(dashboardUserController.update)
    .delete(dashboardUserController.delete)

router.get('/user/create', dashboardUserController.create)
router.get('/user/edit/:id', dashboardUserController.edit)

// History
router.get('/user-history/:id', dashboardUserController.indexHistory)

// Biodata
router.get('/user-biodata/:id', dashboardUserController.editBiodata)
router.put('/user-biodata', dashboardUserController.updateBiodata)

// Popup Modal
router.get('/get-user-biodata/:id', dashboardUserController.getUserBiodata)

module.exports = router