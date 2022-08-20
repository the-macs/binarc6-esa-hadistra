const express = require('express')
const router = express.Router()

const homeController = require('./../controllers/home.controller')
const gamesController = require('./../controllers/games.controller')

const authMiddleware = require('./../middlewares/auth.middleware')

router.get('/', homeController.index)

router.get('/games', authMiddleware.isAuthenticated, gamesController.index)

module.exports = router