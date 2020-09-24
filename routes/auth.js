const express = require('express')
const controller = require('../controllers/auth')
const router = express.Router()
const passport = require('passport')


router.post('/login', controller.login)
router.get('/', controller.getCsrf)
router.get('/role', passport.authenticate('jwt', { session: false }), controller.getRole)
router.post('/register', passport.authenticate('jwt', { session: false }), controller.register)


module.exports = router