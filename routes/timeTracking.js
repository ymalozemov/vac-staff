const express = require('express')
const controller = require('../controllers/timeTracking')
const router = express.Router()

const passport = require('passport')


router.post('/', passport.authenticate('jwt', { session: false }), controller.startNewDay)
router.put('/', passport.authenticate('jwt', { session: false }), controller.addStep)
router.get('/', passport.authenticate('jwt', { session: false }), controller.getTimeTracking)
router.put('/remove', passport.authenticate('jwt', { session: false }), controller.remove)
router.put('/home', passport.authenticate('jwt', { session: false }), controller.home)


module.exports = router