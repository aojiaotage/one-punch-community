const express = require('express')
const router = express.Router()
const User = require('../models/mongo/user')
const auth = require('../middlewares/auth_user')
const multer = require('multer')
const path = require('path')
const upload = multer({dest: path.join(__dirname, '../public/upload')})
const HOST = process.env.NODE_ENV === 'production' ? 'http://some.host/': 'http://localhost:8082'

router.route('/')
  .get((req, res, next) => {
    (async () => {
      let users = await User.getUsers()
      return {
        code: 0,
        users: users,
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
  .post((req, res, next) => {
    (async () => {
      let user = await User.createANewUser({
        name: req.body.name,
        age: req.body.age,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
      })
      return {
        code: 0,
        user: user,
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })

// localhost:8082/user/laoyang
router.route('/:id')
  .get((req, res, next) => {
    (async () => {
      let user = await User.getUserById(req.params.id)
      return {
        code: 0,
        user: user,
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
  // avatar /tmp/:userId/date/hash
  .patch(auth(), upload.single('avatar'), (req, res, next) => {
    (async () => {
      let update = {}
      if (req.body.name) update.name = req.body.name
      if (req.body.age) update.age = req.body.age
      update.avatar = `/upload/${req.file.filename}`
      let user = await User.updateUserById(req.params.id, update)
      user.avatar = `${HOST}${user.avatar}`
      return {
        code: 0,
        user: user,
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })

module.exports = router
