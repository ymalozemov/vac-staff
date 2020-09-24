const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "USER",
  },
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  creator: {
    ref: "User",
    type: Schema.Types.ObjectId,
  },
  timeTracking: [
    {
      startDay: {
        type: Date,
        default: Date.now,
      },
      endDay: {
        type: Date,
      },
      steps: [
        {
          name: {
            type: String,
          },
          time: {
            type: Date,
            default: Date.now,
          },
          deleted: {
            type: Boolean,
            default: false,
          },
          endTime: {
            type: Date,
            default: null,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
