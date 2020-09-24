const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refNumberSchema = new Schema({
  nameTa: {
    type: String,
  },
  number: {
    type: String,
    unique: true,
  },
  count: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Boolean,
    default: false,
  },
  user: {
    ref: "User",
    type: Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("RefNumber", refNumberSchema);
