const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Errors = require('../../errors')
const logger = require('../../utils/logger').logger
const {ObjectId} = Schema.Types

const POINTS_OP_TYPES = {
  LIKE: 'like',
  DISLIKE: 'like',
  REPLY: 'reply',
}

const PointsOpSchema = Schema({
  userId: {type: ObjectId, require: true, index: true},
  points: {type: Number, require: true},
  ts: {type: Number, default: Date.now.valueOf()},
  type: {type: String,}
})

const PointsOpModel = mongoose.model('pointsOp', PointsOpSchema)

async function createPointsOp (userId, type, points) {

  const op = await PointsOpModel.create({
    userId,
    type,
    points,
  })
    .catch(e => {
      logger.error('error creating points op', {err: e.stack || e})
      throw Errors.InternalError('error creating points op')
    })

  return op
}

module.exports = {
  model: PointsOpModel,
  createPointsOp: createPointsOp,
  POINTS_OP_TYPES: POINTS_OP_TYPES
}
