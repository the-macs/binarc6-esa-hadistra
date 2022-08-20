const express = require('express')
const router = express.Router()

const users = require('./../../models/users.model')

// API
router.get('/api/users', (req, res) => {
    res.json(users.getUsers())
})

module.exports = router