const User = require('../models/mongo/user')
const Topic = require('../models/mongo/topic')
const PointsOp = require('../models/mongo/points_op')
const Like = require('../models/mongo/like')
const {ObjectId} = require('mongoose').Types

async function likeTopic (userId, attachedId) {
  await Like.like(ObjectId(userId), ObjectId(attachedId), Like.LIKE_TYPES.TOPIC)
  await User.incrPoints(ObjectId(userId), 10)
  await Topic.likeATopic(attachedId)
  await PointsOp.createPointsOp(ObjectId(userId), PointsOp.POINTS_OP_TYPES.LIKE, 10)
  return true
}

async function likeReply (userId, attachedId) {
  await User.incrPoints(ObjectId(userId), 10)
  await Like.like(ObjectId(userId), ObjectId(attachedId), Like.LIKE_TYPES.REPLY)
  await Topic.likeAReply(attachedId)
  await PointsOp.createPointsOp(ObjectId(userId), PointsOp.POINTS_OP_TYPES.LIKE, 10)
  return true
}

async function dislikeTopic (userId, attachedId) {
  await Like.dislike(userId, attachedId)
  await Topic.dislikeATopic(attachedId)
  await User.incrPoints(ObjectId(userId), -10)
  await PointsOp.createPointsOp(ObjectId(userId), PointsOp.POINTS_OP_TYPES.DISLIKE, -10)
  return true
}

async function dislikeReply (userId, attachedId) {
  await Like.dislike(userId, attachedId)
  await Topic.dislikeAReply(attachedId)
  await User.incrPoints(ObjectId(userId), -10)
  await PointsOp.createPointsOp(ObjectId(userId), PointsOp.POINTS_OP_TYPES.DISLIKE, -10)
  return true
}

module.exports = {
  likeReply,
  likeTopic,
  dislikeTopic,
  dislikeReply,
}
