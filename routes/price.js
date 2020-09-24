const express = require('express')
const controller = require('../controllers/price')
const router = express.Router()

const passport = require('passport')


router.put('/update', passport.authenticate('jwt', { session: false }), controller.update)
router.get('/', passport.authenticate('jwt', { session: false }), controller.getAll)


module.exports = router