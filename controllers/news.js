const News = require("../models/News");
const errorHandler = require("../utils/errorHandler");

module.exports.create = async function (req, res) {
  try {
    const news = new News({ ...req.body });
    await news.save();
    res.status(201).json({ message: "Новость создана." });
  } catch (e) {
    errorHandler(res, e);
  }
};
