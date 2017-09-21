const express = require('express')
const router = express.Router()
const User = require('../models/mongo/user')
const Topic = require('../models/mongo/topic')
const auth = require('../middlewares/auth_user')
const LikeService = require('../services/like_service')

// localhost:8082/topic/
router.route('/')
  .get((req, res, next) => {
    (async () => {
      let topics = await Topic.getTopics({})
      return {
        code: 0,
        topics: topics,
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
  .post(auth({loadJWTUser: true}), (req, res, next) => {
    (async () => {
      const user = await User.getUserById(req.user._id)
      let topic = await Topic.createANewTopic({
        creator: user,
        title: req.body.title,
        content: req.body.content,
      })
      return {
        code: 0,
        topic: topic,
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })

router.route('/:id')
  .get((req, res, next) => {
    (async () => {
      let topic = await Topic.getTopicById(req.params.id)
      return {
        code: 0,
        topic: topic,
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
  .patch(auth({loadJWTUser: true}), (req, res) => {
    (async () => {
      let topic = await Topic.updateTopicById(req.params.id, {
        content: req.body.content,
      })
      return {
        code: 0,
        topic: topic,
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })

router.route('/:id/like')
  .patch(auth({loadJWTUser: true}), (req, res, next) => {
    (async () => {
      await LikeService.likeTopic(req.user._id, req.params.id)
      return {
        code: 0,
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
  .delete(auth({loadJWTUser: true}), (req, res, next) => {
    (async () => {
      await LikeService.dislikeTopic(req.user._id, req.params.id)
      return {
        code: 0,
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })

router.route('/:id/reply')
  .post(auth({loadJWTUser: true}), (req, res, next) => {
    (async () => {
      const user = await User.getUserById(req.user._id)
      let topic = await Topic.replyATopic({
        topicId: req.params.id,
        creator: user,
        content: req.body.content,
      })
      return {
        code: 0,
        topic: topic,
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })

router.route('/:id/reply/:replyId/like')
  .patch(auth({loadJWTUser: true}), (req, res, next) => {
    (async () => {
      await LikeService.likeReply(req.user._id, req.params.replyId)
      return {
        code: 0,
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
  .delete(auth({loadJWTUser: true}), (req, res, next) => {
    (async () => {
      await LikeService.dislikeReply(req.user._id, req.params.replyId)
      return {
        code: 0,
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
