const Like = {
  like: async function (userId, attachedId, type) {
    return {
      userId,
      attachedId,
      type,
    }
  },
  LIKE_TYPES: {
    TOPIC: 'topic',
    REPLY: 'reply',
    USER: 'user'
  }
}

module.exports = Like
