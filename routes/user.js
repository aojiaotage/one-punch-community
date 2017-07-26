const express = require('express');
const router = express.Router();
const User = require('../models/in_memo/user');

// localhost:8082/user/
router.route('/')
  .get((req, res, next) => {
    (async () => {
      let users = await User.getUsers();
      return {
        code: 0,
        users: users,
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
      let user = await User.createANewUser({
        name: req.body.name,
        age: req.body.age,
      });
      return {
        code: 0,
        user: user,
      }
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      })
  });

// localhost:8082/user/laoyang
router.route('/:id')
  .get((req, res, next) => {
    (async () => {
      let user = await User.getUserById(Number(req.params.id));
      return {
        code: 0,
        user: user,
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
      let user = await User.updateUserById(Number(req.params.id), {
        name: req.body.name,
        age: req.body.age,
      });
      return {
        code: 0,
        user: user,
      }
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      })
  })

module.exports = router;
