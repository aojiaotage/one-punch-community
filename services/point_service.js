const User = require('../models/mongo/user')
const PointsOp = require('../models/mongo/points_op')
const redis = require('./redis_service')
const logger = require('../utils/logger').logger
const Errors = require('../errors')
const USER_POINTS_SORT_SET_KEY = 'user_points_sort_set'

async function incrUserPoints (userId, incr, type) {
  await User.incrPoints(userId, incr)
  await PointsOp.createPointsOp(userId, type, incr)
  await redis.zincrby(USER_POINTS_SORT_SET_KEY, incr, userId)
    .catch(e => {
      const errorMsg = 'error incr user points to redis sorted set'
      logger.error(errorMsg, {err: e.stack || e})
      throw new Errors.InternalError(errorMsg)
    })
}

async function getPointsRankBrief () {
  const userIds = await redis.zrevrangebyscore(USER_POINTS_SORT_SET_KEY,
    '+inf', '-inf', 'LIMIT', 0, 5)
    .catch(e => {
      const errorMsg = 'error getting points rank from redis'
      logger.error(errorMsg, {err: e.stack || e})
      throw new Errors.InternalError(errorMsg)
    })
  if (!userIds || userIds.length === 0) return []
  const users = await User.model.find({_id: {$in: userIds}}, {_id: 1, name: 1, points: 1})
  return users
}

module.exports = {
  incrUserPoints,
  getPointsRankBrief,
}