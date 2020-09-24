const mongoose = require('mongoose')
const Schema = mongoose.Schema

const priceSchema = new Schema({
  services: [
    {
      name: {
        type: String,
      },
      value: {
        type: String
      },
      cost: {
        type: Number,
        default: 0
      }
    }
  ],
  foxServices: [
    {
      name: {
        type: String,
      },
      value: {
        type: String
      },
      cost: {
        type: Number,
        default: 0
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    ref: 'User',
    type: Schema.Types.ObjectId
  }
})


module.exports = mongoose.model('Price', priceSchema)