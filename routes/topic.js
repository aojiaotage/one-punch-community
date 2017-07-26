const express = require('express');
const router = express.Router();
const User = require('../models/in_memo/user');
const Topic = require('../models/in_memo/topic');

// localhost:8082/topic/
router.route('/')
  .get((req, res, next) => {
    (async () => {
      let topics = await Topic.getTopics();
      return {
        code: 0,
        topics: topics,
      }
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      })
  })
  .post((req, res, next) => {
    (async () => {
      const user = await User.getUserById(req.body.userId);
      let topic = await Topic.createANewTopic({
        creator: user,
        title: req.body.title,
        content: req.body.content,
      });
      return {
        code: 0,
        topic: topic,
      }
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      })
  });

// localhost:8082/topic/laoyang
router.route('/:id')
  .get((req, res, next) => {
    (async () => {
      let topic = await Topic.getTopicById(Number(req.params.id));
      return {
        code: 0,
        topic: topic,
      }
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      })
  })
  .patch((req, res) => {
    (async () => {
      let topic = await Topic.updateTopicById(Number(req.params.id), {
        name: req.body.name,
        age: req.body.age,
      });
      return {
        code: 0,
        topic: topic,
      }
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      })
  })

router.route('/:id/reply')
  .post((req, res, next) => {
    (async () => {
      const user = await User.getUserById(req.body.userId);
      let topic = await Topic.replyATopic({
        topicId: req.params.id,
        creator: user,
        content: req.body.content,
      });
      return {
        code: 0,
        topic: topic,
      }
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      })
  });


module.exports = router;
