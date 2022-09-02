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
router.route('/sign-up', authMiddleware.isGuest)
    .get(userController.signup)
    .post(userController.register)

// User Setup
router.route('/setting', authMiddleware.isAuthenticated)
    .put(userController.updateUser)
    .get(userController.setting)

router.post('/delete-account', authMiddleware.isAuthenticated, userController.deleteUser)

module.exports = router