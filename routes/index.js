const express = require('express')
const router = express.Router()
const User = require('../models/mongo/user')
const JWT = require('jsonwebtoken')
const JWT_SECRET = require('../cipher').JWT_SECRET
const Errors = require('../errors')
const WechatService = require('../services/wechat_service')
const response = require('../utils/response')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'})
})

router.post('/login', (req, res, next) => {
  (async () => {

    if(!req.body.password) throw new Errors.ValidationError('password', 'password can not be empty')
    if(typeof req.body.password !== 'string') throw new Errors.ValidationError('password', 'password must be a string')
    if(req.body.password.length < 8) throw new Errors.ValidationError('password', 'password must longer than 8 characters')
    if(req.body.password.length > 32) throw new Errors.ValidationError('password', 'password can not be longer than 32 characters')

    const user = await User.login(req.body.phoneNumber, req.body.password)

    const token = JWT.sign({_id: user._id, iat: Date.now(), expire: Date.now() + 24 * 60 * 60 * 1000}, JWT_SECRET)

    return {
      code: 0,
      data: {
        user: user,
        token: token,
      }
    }
  })()
    .then(r => {
      res.data = r
      response(req, res, next)
    })
    .catch(e => {
      next(e)
    })
})

router.post('/wechat/login', (req, res, next)=>{
  (async () => {
    const {code} = req.body
    const user = await WechatService.getUserInfoByCode(code)
    const foundOrCreated = await User.loginWithWechat(user)
    const token = JWT.sign({_id: user._id, iat: Date.now(), expire: Date.now() + 24 * 60 * 60 * 1000}, JWT_SECRET)

    return {
      code: 0,
      data: {
        user: foundOrCreated,
        token: token,
      }
    }
  })()
    .then(r => {
      res.data = r
      response(req, res, next)
    })
    .catch(e => {
      next(e)
    })
})

module.exports = router
