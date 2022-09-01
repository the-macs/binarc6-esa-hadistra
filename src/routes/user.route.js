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
router.get('/sign-up', authMiddleware.isGuest, userController.signup)

router.post('/sign-up', authMiddleware.isGuest, userController.register)

// User Setup
router.post('/setting', authMiddleware.isAuthenticated, userController.updateUser)

router.get('/setting', authMiddleware.isAuthenticated, userController.setting)

router.post('/delete-account', authMiddleware.isAuthenticated, userController.deleteUser)

module.exports = router