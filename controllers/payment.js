const RefNumber = require("../models/RefNumber");
const Payment = require("../models/Payment");
const PaymentTa = require("../models/PaymentTa");
const errorHandler = require("../utils/errorHandler");

module.exports.create = async function (req, res) {
  try {
    const candidateContract = await Payment.findOne({
      contract: req.body.contract,
    });
    if (candidateContract) {
      res
        .status(409)
        .json({ message: "Такой номер договора уже использовался." });
    } else {
      let payment = new Payment({ ...req.body, user: req.user._id });
      await payment.save();
      res.status(201).json({ message: "Счет был создан." });
    }
  } catch (e) {
    if (e.code == "11000") {
      if (e.keyValue["barcodes.value"]) {
        res.status(406).json({
          message: `Такой баркод уже был создан в системе: ${e.keyValue["barcodes.value"]}`,
        });
      }
    } else {
      errorHandler(res, e);
    }
  }
};
module.exports.createTa = async function (req, res) {
  try {
    const candidateContract = await PaymentTa.findOne({
      contract: req.body.contract,
    });
    if (candidateContract) {
      res
        .status(409)
        .json({ message: "Такой номер договора уже использовался." });
    } else {
      let payment = new PaymentTa({ ...req.body, user: req.user._id });
      await payment.save();
      const id = req.body.refNumbers.map((value) => value._id);
      await RefNumber.updateMany({ _id: { $in: id } }, { created: true });
      res.status(201).json({ message: "Счет был создан." });
    }
  } catch (e) {
    if (e.code == "11000") {
      if (e.keyValue["refNumbers"]) {
        const refNumber = await RefNumber.findById(e.keyValue["refNumbers"]);
        res.status(406).json({
          message: `Такой RefNumber уже был создан в системе: ${refNumber.number}`,
        });
      }
    } else {
      errorHandler(res, e);
    }
  }
};
module.exports.sendMessage = async function (req, res) {
  try {
    let candidate = await Payment.findByIdAndUpdate(req.body.id, {
      message: req.body.message.message,
      remark: true,
      correction: false,
    });
    if (candidate) {
      res.status(201).json({ message: "Сообщение отправлено." });
    }
    let candidateTa = await PaymentTa.findByIdAndUpdate(req.body.id, {
      message: req.body.message.message,
      remark: true,
      correction: false,
    });
    if (candidateTa) {
      res.status(201).json({ message: "Сообщение отправлено." });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
module.exports.getAllToday = async function (req, res) {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  try {
    const payments = await Payment.find({
      date: { $gte: startOfToday },
    }).lean().populate({ path: "user", select: "name login" });

    const paymentsTa = await PaymentTa.find({
      date: { $gte: startOfToday },
    }).lean().populate({ path: "user", select: "name login" });

    let paymnetsAll = payments.concat(paymentsTa);
    res.status(200).json(paymnetsAll);
  } catch (e) {
    errorHandler(res, e);
  }
};
module.exports.getById = async function (req, res) {
  try {
    let candidate = await Payment.findById(req.params.id);
    if (candidate) {
      res.status(200).json(candidate);
    }
    let candidateTa = await PaymentTa.findById(req.params.id);
    if (candidateTa) {
      await candidateTa.populate("refNumbers").execPopulate();
      res.status(200).json(candidateTa);
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
module.exports.approve = async function (req, res) {
  try {
    let candidate = await Payment.findByIdAndUpdate(req.body.id, {
      remark: false,
      correction: false,
      approve: true,
    });
    if (candidate) {
      res.status(201).json({ message: "Счет подтвержден." });
    }
    let candidateTa = await PaymentTa.findByIdAndUpdate(req.body.id, {
      remark: false,
      correction: false,
      approve: true,
    });
    if (candidateTa) {
      res.status(201).json({ message: "Счет подтвержден." });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
module.exports.unapprove = async function (req, res) {
  try {
    let candidate = await Payment.findByIdAndUpdate(req.body.id, {
      approve: false,
    });
    if (candidate) {
      res.status(201).json({ message: "Счет снят с подтверждения." });
    }
    let candidateTa = await PaymentTa.findByIdAndUpdate(req.body.id, {
      approve: false,
    });
    if (candidateTa) {
      res.status(201).json({ message: "Счет снят с подтверждения." });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
module.exports.find = async function (req, res) {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  try {
    let candidate = await Payment.find({
      contract: { $regex: req.body.contract, $options: "i" },
      date: { $gte: startOfToday },
    });
    let candidateTa = await PaymentTa.find({
      contract: { $regex: req.body.contract, $options: "i" },
      date: { $gte: startOfToday },
    });
    if (candidate.length > 0 && candidateTa.length > 0) {
      let arr = candidate.concat(candidateTa);
      res.status(201).json(arr);
    } else if (candidate.length > 0) {
      res.status(201).json(candidate);
    } else if (candidateTa.length > 0) {
      res.status(201).json(candidateTa);
    } else {
      res.status(201).json([]);
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
module.exports.getAllTodayUser = async function (req, res) {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  try {
    const payments = await Payment.find({
      date: { $gte: startOfToday },
      user: { $in: req.user._id },
    }).populate({ path: "user", select: "name login" });

    const paymentsTa = await PaymentTa.find({
      date: { $gte: startOfToday },
      user: { $in: req.user._id },
    }).populate({ path: "user", select: "name login" });

    let paymnetsAll = payments.concat(paymentsTa);
    res.status(200).json(paymnetsAll);
  } catch (e) {
    errorHandler(res, e);
  }
};
module.exports.updateById = async function (req, res) {
  try {
    let candidate = await Payment.findByIdAndUpdate(
      req.body.id,
      req.body,
      (err, res) => {
        if (res) {
          if (res.remark) {
            res.remark = false;
            res.correction = true;
          }
          res.save();
        }
      }
    );
    if (candidate) {
      res.status(201).json({ message: "Счет обновлен." });
    }
    let candidateTa = await PaymentTa.findByIdAndUpdate(
      req.body.id,
      req.body,
      (err, res) => {
        if (res) {
          if (res.remark) {
            res.remark = false;
            res.correction = true;
          }
          res.save();
        }
      }
    );
    if (candidateTa) {
      let paymentTa = await PaymentTa.findById(req.body.id);
      await RefNumber.updateMany(
        { _id: { $in: paymentTa.refNumbers } },
        { created: true }
      );
      res.status(201).json({ message: "Счет обновлен." });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
module.exports.updateRefStatus = async function (req, res) {
  try {
    await PaymentTa.findById(req.body.idPayment.idPayment, (err, res) => {
      let index = res.refNumbers.findIndex(
        (refNumber) => refNumber == req.body.idRef.idRef
      );
      res.refNumbers.splice(index, 1);
      res.save();
    });
    await RefNumber.findByIdAndUpdate(req.body.idRef.idRef, { created: false });
    res.status(201).json({ message: "Refnumber удален из счета." });
  } catch (e) {
    errorHandler(res, e);
  }
};
module.exports.update = async function (req, res) {
  try {
  } catch (e) {
    errorHandler(res, e);
  }
};
