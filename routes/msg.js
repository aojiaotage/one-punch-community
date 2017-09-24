const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth_user')
const MsgService = require('../services/msg_service')
const response = require('../utils/response')

router
  .route('/')
  .get(auth({loadJWTUser: true}), (req, res, next) => {
    (async () => {

      const userId = req.user._id
      const page = Number(req.query.page) || 0
      const pageSize = Number(req.query.pageSize) || 10

      const msgs = await MsgService.getUserReceivedMsgs({
        userId,
        page,
        pageSize,
      })
      return {
        code:0,
        msgs,
      }

    })()
      .then(r => {
        res.data = r
        response(req, res)
      })
      .catch(e => {
        res.err = e
        response(req, res)
      })
  })
  .post(auth({loadJWTUser: true}), (req, res, next) => {
    (async () => {

      const {to, content} = req.body
      const msg = await MsgService.sendAMsgByUser(req.user._id, to, content)
      return {
        code: 0,
        msg,
      }

    })()
      .then(r => {
        res.data = r
        response(req, res, next)
      })
      .catch(e => {
        res.next(e)
      })
  })

module.exports = router
