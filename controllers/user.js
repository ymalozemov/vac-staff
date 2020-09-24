const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')


module.exports.getAll = async function (req, res) {
  try {
    const candidate = await User.find({}, 'name login role')
    if (candidate) {
      res.status(200).json(candidate)
    }
  } catch (e) {
    errorHandler(res, e)
  }
}
module.exports.getById = async function (req, res) {
  try {
    const candidate = await User.findById(req.params.id)
    if (candidate) {
      res.status(200).json(candidate)
    }
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.update = async function (req, res) {
  try {

  } catch (e) {
    errorHandler(res, e)
  }
}
