const RefNumber = require("../models/RefNumber");
const errorHandler = require("../utils/errorHandler");

module.exports.getAll = async function (req, res) {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  try {
    const refNumbers = await RefNumber.find({
      date: { $gte: startOfToday },
      created: false,
    });
    res.status(200).json(refNumbers);
  } catch (e) {
    errorHandler(res, e);
  }
};
module.exports.getById = async function (req, res) {
  try {
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function (req, res) {
  try {
    const candidate = await RefNumber.findOne({ number: req.body.number });
    if (candidate) {
      res.status(409).json({ message: "Такой RefNumber уже есть." });
    } else {
      const refNumber = new RefNumber({ ...req.body, user: req.user._id });
      await refNumber.save();
      res.status(201).json({ message: "RefNumber создан." });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
