const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authentication')
const adminAuth = require('../middleware/authorization')

const { register, login } = require('../controllers/auth')

router.post('/register', authenticate, adminAuth, register)

router.post('/login', login)

module.exports = router
