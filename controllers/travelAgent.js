const TravelAgent = require('../models/TravelAgent')
const errorHandler = require('../utils/errorHandler')


module.exports.getAll = async function (req, res) {
  try {
    const travelAgents = await TravelAgent.find({})
    if (travelAgents) {
      res.status(200).json(travelAgents)
    }
  } catch (e) {
    errorHandler(res, e)
  }
}
module.exports.getById = async function (req, res) {
  try {
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.create = async function (req, res) {
  try {
    const candidate = await TravelAgent.findOne({ name: req.body.name })
    if (candidate) {
      res.status(409).json({ message: 'Такое название уже есть.' })
    } else {
      const travelAgent = new TravelAgent({ ...req.body, user: req.user._id })
      await travelAgent.save()
      res.status(201).json({ message: 'Агенство создано.' })
    }
  } catch (e) {
    errorHandler(res, e)
  }
}
