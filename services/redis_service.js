const Redis = require('ioredis')

let redis = new Redis({
  host:'localhost',
  port:6379,
})

module.exports = redis;
