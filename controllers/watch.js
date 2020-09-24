const RefNumber = require("../models/RefNumber");
const Payment = require("../models/Payment");
const PaymentTa = require("../models/PaymentTa");
const SSE = require("sse-nodejs");
const errorHandler = require("../utils/errorHandler");

let userList = [];
let userListTa = [];

let userListTreatment = [];

async function doc(data) {
  console.log(data);
  if (
    data.ns.coll == "paymenttas" &&
    data.updateDescription &&
    data.updateDescription.updatedFields &&
    data.updateDescription.updatedFields.message
  ) {
    const doc = await PaymentTa.findById(data.documentKey._id);
    if (doc) {
      userListTa.push(doc.user);
    }
  }
  if (
    data.ns.coll == "payments" &&
    data.updateDescription &&
    data.updateDescription.updatedFields &&
    data.updateDescription.updatedFields.message
  ) {
    const doc = await Payment.findById(data.documentKey._id);
    if (doc) {
      userList.push(doc.user);
    }
  }
}

PaymentTa.watch().on("change", (data) => {
  doc(data);
});
Payment.watch().on("change", (data) => {
  doc(data);
});

module.exports.watch = async function (req, res) {
  let app = SSE(res);
  try {
    let myTimer = setInterval(() => {
      let user = req.user._id;
      userListTa.findIndex((id, idx) => {
        if (id != undefined) {
          if (id.toString() === user.toString()) {
            app.send("payment_ta");
            delete userListTa[idx];
          }
        }
      });
      userList.findIndex((id, idx) => {
        if (id != undefined) {
          if (id.toString() === user.toString()) {
            app.send("payment_ind");
            delete userList[idx];
          }
        }
      });
      app.send("true");
    }, 4000);

    app.disconnect(function () {
      console.log("disconnect");
      res.status(204);
      clearInterval(myTimer);
    });
  } catch (e) {
    errorHandler(res, e);
  }
};
