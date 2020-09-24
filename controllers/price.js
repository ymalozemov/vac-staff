const Price = require('../models/Price')
const errorHandler = require('../utils/errorHandler')


module.exports.getAll = async function (req, res) {
  defaltPrice = [
    {
      name: "Консульский сбор для граждан России и Украины",
      value: 'rus'
    },
    {
      name: "Консульский сбор для иностранных граждан",
      value: 'nonRus'
    },
    {
      name: "Сервисный сбор",
      value: 'service'
    },
    {
      name: "Персональный ассистент",
      value: 'pers'
    },
    {
      name: "VIP",
      value: 'vip'
    },
    {
      name: "Заполнение анкеты",
      value: 'form'
    },
    {
      name: "SMS - оповещение",
      value: 'sms'
    },
    {
      name: "Ксерокопия",
      value: 'copy'
    },
    {
      name: "Ксерокопия более 10 шт.",
      value: 'copy10'
    },
    {
      name: "Приоритетная выдача",
      value: 'ppb'
    },
    {
      name: "Фотография",
      value: 'photo'
    }
  ]
  defaulFoxPrice = [
    {
      name: "Fox Service",
      value: 'foxService'
    },
    {
      name: "Zone FE-VIP-N",
      value: 'feVip'
    },
    {
      name: "Zone FE-1-N",
      value: 'fe1'
    },
    {
      name: "Zone FE-2-N",
      value: 'fe2'
    },
    {
      name: "Zone FE-3-N",
      value: 'fe3'
    },
    {
      name: "Zone FE-4-N",
      value: 'fe4'
    },
    {
      name: "Zone FE-5-N",
      value: 'fe5'
    },
    {
      name: "Zone FE-6-N",
      value: 'fe6'
    },
    {
      name: "Zone FE-7-N",
      value: 'fe7'
    },
    {
      name: "Zone FE-8-N",
      value: 'fe8'
    },
    {
      name: "Zone FE-9-N",
      value: 'fe9'
    },
    {
      name: "Zone FE-10-N",
      value: 'fe10'
    },
    {
      name: "Zone FE-11-N",
      value: 'fe11'
    },
    {
      name: "Zone FE-12-N",
      value: 'fe12'
    },
    {
      name: "Zone FE-13-N",
      value: 'fe13'
    },
    {
      name: "Zone FE-14-N",
      value: 'fe14'
    },
    {
      name: "Zone FE-15-N",
      value: 'fe15'
    },
    {
      name: "Zone FE-VIP-REG-N",
      value: 'fevipReg'
    },
    {
      name: "Zone FE-0-N",
      value: 'fe0'
    }
  ]
  try {
    const candidate = await Price.find()
    if (candidate.length) {
      res.status(200).json(candidate[0])
    } else {
      const price = new Price({
        services: defaltPrice,
        foxServices: defaulFoxPrice,
        user: req.user._id
      })
      await price.save()
      res.status(200).json(price)
    }
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.update = async function (req, res) {
  try {
    await Price.findOneAndUpdate({ _id: req.body._id }, req.body)

    res.status(200).json({ message: 'Счет был обновлен.' })

  } catch (e) {
    errorHandler(res, e)
  }
}
