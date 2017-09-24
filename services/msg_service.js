const Msg = require('../models/mongo/msg')
const redis = require('./redis_service')
const Errors = require('../errors')
const logger = require('../utils/logger').logger

const UNREAD_MSGS_HSET = 'unread_msgs_hset'

async function sendAMsgByUser (from, to, content) {
  const msg = await Msg.createAMsg(from, to, content, Msg.MSG_TYPES.USER)
  await _incrUserUnreadCount(to, 1)
  return msg
}

async function sendAMsgBySys (from, to, content) {
}

async function _incrUserUnreadCount (userId, incr) {
  const result = await redis.hincrby(UNREAD_MSGS_HSET, userId, incr)
    .catch(e => {
      const errorMsg = 'error incr user unread count'
      logger.error(errorMsg, {err: e.stack || e})
      throw Errors.InternalError(errorMsg)
    })
  return result
}

async function _clearUserUnreadCount (userId) {
  const result = await redis.hdel(UNREAD_MSGS_HSET, userId)
    .catch(e => {
      const errorMsg = 'error incr user unread count'
      logger.error(errorMsg, {err: e.stack || e})
      throw Errors.InternalError(errorMsg)
    })
  return result
}

async function getUserUnreadCount (userId) {
  const result = await redis.hget(UNREAD_MSGS_HSET, userId)
    .then(r => {
      return Number(r) || 0
    })
    .catch(e => {
      const errorMsg = 'error incr user unread count'
      logger.error(errorMsg, {err: e.stack || e})
      throw Errors.InternalError(errorMsg)
    })
  return result
}

async function getUserReceivedMsgs (query) {
  const msgs = await Msg.listUserReceivedMsgs(query)
  await _clearUserUnreadCount(query.userId)
  return msgs
}

module.exports = {
  sendAMsgByUser,
  getUserUnreadCount,
  getUserReceivedMsgs,
}
