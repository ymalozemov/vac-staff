const mongoose = require('mongoose')
const Schema = mongoose.Schema

const travelAgentSchema = new Schema({
  name: {
    type: String
  },
  tel: {
    type: String
  },
  email: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    ref: 'User',
    type: Schema.Types.ObjectId
  }
})


module.exports = mongoose.model('TravelAgent', travelAgentSchema)