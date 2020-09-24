const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')


module.exports.getTimeTracking = async function (req, res) {
  let date = new Date()
  try {
    const candidate = await User.findById(req.user._id, 'timeTracking')
    if (candidate) {
      let sendDay = candidate.timeTracking.find(day => {
        return (day.startDay.getDate() === date.getDate()) && (day.startDay.getMonth() === date.getMonth()) && (day.startDay.getFullYear() === date.getFullYear())
      })
      if (sendDay) {
        res.status(200).json(sendDay)
      } else {
        res.status(200).json([])
      }
    }
  } catch (e) {
    errorHandler(res, e)
  }
}
module.exports.startNewDay = async function (req, res) {
  try {
    const candidate = await User.findById(req.user._id)
    if (candidate) {
      candidate.timeTracking.push({ steps: [{ name: req.body.name }] })
      await User.findByIdAndUpdate(req.user._id, candidate)
      res.status(201).json(candidate.timeTracking[candidate.timeTracking.length - 1])
    }
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.addStep = async function (req, res) {
  try {
    //console.log(req.body.id)
    const candidate = await User.findById(req.user._id)
    if (candidate) {
      //find index by id from client
      let index = candidate.timeTracking.findIndex(day => day._id == req.body.id)
      //add to pre step endTime 
      candidate.timeTracking[index].steps[req.body.stepIndex].endTime = new Date()
      //push new step to steps 
      candidate.timeTracking[index].steps.push({ name: req.body.step.name })
      await User.findByIdAndUpdate(req.user._id, candidate)
      res.status(201).json(candidate.timeTracking[index])
    }
  } catch (e) {
    errorHandler(res, e)
  }
}
module.exports.remove = async function (req, res) {
  try {
    const candidate = await User.findById(req.user._id)
    if (candidate) {
      let index = candidate.timeTracking.findIndex(day => day._id == req.body.id)
      candidate.timeTracking[index].steps[req.body.stepIndex].deleted = true
      if (req.body.step.name === "Домой") {
        candidate.timeTracking[index].endDay = ''
      }
      await User.findByIdAndUpdate(req.user._id, candidate)
      res.status(201).json(candidate.timeTracking[index])
    }
  } catch (e) {
    errorHandler(res, e)
  }
}
module.exports.home = async function (req, res) {
  try {
    const candidate = await User.findById(req.user._id)
    if (candidate) {
      let index = candidate.timeTracking.findIndex(day => day._id == req.body.id)
      candidate.timeTracking[index].steps[req.body.stepIndex].endTime = new Date()
      candidate.timeTracking[index].endDay = new Date()
      candidate.timeTracking[index].steps.push({ name: req.body.step.name })
      await User.findByIdAndUpdate(req.user._id, candidate)
      res.status(201).json(candidate.timeTracking[index])
    }
  } catch (e) {
    errorHandler(res, e)
  }
}