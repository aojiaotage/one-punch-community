const PointsOp = {
  createPointsOp: async function (userId, type, points) {
    return {
      points: points,
      type: type,
      userId: userId,
    }
  },
  POINTS_OP_TYPES: {
    LIKE: 'like',
    REPLY: 'reply',
  }
}

module.exports = PointsOp
