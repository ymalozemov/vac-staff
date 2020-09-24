const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.getCsrf = async function (req, res) {
  try {
    res.status(200).json({ message: 'done' })
  } catch (e) {
    errorHandler(res, e)
  }
}
module.exports.getRole = async function (req, res) {
  try {
    const candidate = await User.findById(req.user._id)
    if (candidate) {
      let date = new Date()
      let today = candidate.timeTracking.find(day => {
        return ((new Date(day.startDay).getDate() == date.getDate()) && (new Date(day.startDay).getMonth() == date.getMonth()) && (new Date(day.startDay).getFullYear() == date.getFullYear()))
      })
      let lastStepIndex = 0
      let lastStepDeleted = true
      let lastStepName = ''
      if (today) {
        lastStepIndex = today.steps.length - 1
        lastStepDeleted = today.steps[lastStepIndex].deleted
        lastStepName = today.steps[lastStepIndex].name
      }
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      if (today && lastStepDeleted == false && lastStepName != "Обед" && lastStepName != "Перерыв" && lastStepName != "Домой") {
        res.status(200).json({
          role: candidate.role,
          isCheckIn: true
        })
      } else {
        res.status(200).json({
          role: candidate.role,
          isCheckIn: false
        })
      }
    } else {
      res.status(409).json({
        message: "Что-то пошло не так. Пожалуйста, попробуйте снова."
      })
    }
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.login = async function (req, res) {
  try {
    const candidate = await User.findOne({ login: req.body.login })
    if (candidate) {
      bcryptjs.compare(req.body.password, candidate.password, async function (err, passwordCompare) {
        if (err) {
          res.status(409).json({
            message: "При логине пользователя, что то пошло не так, попробуйте снова."
          })
        } else {
          if (passwordCompare) {
            const token = jwt.sign({
              login: candidate.login,
              userId: candidate._id
            }, keys.JWT, { expiresIn: 60 * 60 })

            res.status(200).json({
              token: `Bearer ${token}`,
              role: candidate.role
            })
          } else {
            res.status(409).json({
              message: "Неправильный пароль, попробуйте снова."
            })
          }
        }
      })
    } else {
      res.status(404).json({
        message: "Пользователь с таким логином не найден."
      })
    }
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.register = async function (req, res) {
  try {
    const candidate = await User.findOne({ login: req.body.login })
    if (candidate) {
      res.status(409).json({
        message: "Пользователь с таким логином уже создан, попробуйте другой."
      })
    } else {
      bcryptjs.genSalt(10, async function (err, salt) {
        if (err) {
          res.status(409).json({
            message: "При создании пользователя, что то пошло не так, попробуйте снова."
          })
        } else {
          bcryptjs.hash(req.body.password, salt, async function (err, hash) {
            if (err) {
              res.status(409).json({
                message: "При создании пользователя, что то пошло не так, попробуйте снова."
              })
            } else {
              const user = new User({
                name: req.body.name,
                login: req.body.login,
                password: hash,
                creator: req.user._id
              })
              await user.save()
              res.status(201).json({
                message: "Пользователь создан"
              })
            }
          })
        }

      })
    }

  } catch (e) {
    errorHandler(res, e)
  }
}