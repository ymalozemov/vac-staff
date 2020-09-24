const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const news = new Schema({
  user: {
    type: String,
    default: "",
  },
  userPosition: {
    type: String,
    default: "USER",
  },
  text: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("User", userSchema);
