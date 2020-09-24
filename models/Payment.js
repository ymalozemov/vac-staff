const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  applicant: {
    type: Number,
    required: true,
  },
  contract: {
    type: String,
    required: true,
  },
  barcodes: [
    {
      value: {
        type: String,
        unique: true,
      },
      fee: {
        type: String,
      },
    },
  ],
  copy: {
    type: Number,
  },
  form: {
    type: Number,
  },
  foxCount: {
    type: Number,
  },
  foxValue: {
    type: String,
  },
  photo: {
    type: Number,
  },
  sms: {
    type: Number,
  },
  vip: {
    type: Number,
  },
  pers: {
    type: Number,
  },
  ppb: {
    type: Number,
  },
  message: {
    type: String,
  },
  approve: {
    type: Boolean,
    default: false,
  },
  remark: {
    type: Boolean,
    default: false,
  },
  correction: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    ref: "User",
    type: Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
