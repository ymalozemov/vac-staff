const express = require('express')
const controller = require('../controllers/travelAgent')
const router = express.Router()

const passport = require('passport')


router.post('/', passport.authenticate('jwt', { session: false }), controller.create)
router.get('/', passport.authenticate('jwt', { session: false }), controller.getAll)
router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getById)


module.exports = router