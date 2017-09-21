const {ObjectId} = require('mongoose').Types
const User = {
  incrPoints: async function (userId, points) {
    if(!(userId instanceof ObjectId)) throw Error('userid should be an object id')
    return true
  }
}

module.exports = User
