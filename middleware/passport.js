const JwtStatagy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../models/User')
const keys = require('../config/keys')

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.JWT
}

module.exports = passport => {
  passport.use(
    new JwtStatagy(options, async (payload, done) => {
      try {
        //payload.userId from controllers/auth - method login - if(passwordCompare)
        const user = await User.findById(payload.userId).select('email id')
        if (user) {
          //done ( err = null,response = user)
          done(null, user)
        } else {
          //done (err = null, response = false )
          done(null, false)
        }
      } catch (e) {
        console.log(e)
      }

    })
  )
}