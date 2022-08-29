const express = require('express')
const router = express.Router()

const dashboardUserController = require('../../controllers/dashboard/user.controller')

const authMiddleware = require('./../../middlewares/auth.middleware')

// router.use(authMiddleware.isAuthenticatedWithAdmin)

router.get('/', (req, res) => res.redirect('/dashboard/user'))

router.get('/user', dashboardUserController.index)

router.get('/user/create', dashboardUserController.create)


router.get('/user/edit/:id', dashboardUserController.edit)

router.post('/user', dashboardUserController.store)

router.put('/user', dashboardUserController.update)


router.delete('/user', dashboardUserController.delete)

// History
router.get('/user-history/:id', dashboardUserController.getHistory)

// Biodata
router.get('/user-biodata/:id', dashboardUserController.getBiodata)
router.put('/user-biodata', dashboardUserController.updateBiodata)


module.exports = router