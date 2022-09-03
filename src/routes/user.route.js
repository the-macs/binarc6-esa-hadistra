const express = require('express')
const router = express.Router()

const authController = require('./../controllers/auth.controller')
const userController = require('./../controllers/user.controller')

const authMiddleware = require('./../middlewares/auth.middleware')

// Authentication
router.get('/login', authMiddleware.isGuest, userController.login)

router.post('/auth', authMiddleware.isGuest, authController.auth)

router.post('/logout', authMiddleware.isAuthenticated, authController.logout)


// Registrasi
router.route('/sign-up',)
    .get(authMiddleware.isGuest, userController.signup)
    .post(authMiddleware.isGuest, userController.register)

// User Setup
router.route('/setting')
    .put(authMiddleware.isAuthenticated, userController.updateUser)
    .get(authMiddleware.isAuthenticated, userController.setting)

router.post('/delete-account', authMiddleware.isAuthenticated, userController.deleteUser)

module.exports = router