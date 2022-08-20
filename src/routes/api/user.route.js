const express = require('express')
const router = express.Router()

const User = require('../../models/user.model')

// API
router.get('/api/users', async (req, res) => {
    const users = await User.find()
    res.json(users)
})

module.exports = router