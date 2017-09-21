let User = require('../../mocks/user')
let Topic = require('../../mocks/topic')
let PointsOp = require('../../mocks/points_op')
let Like = require('../../mocks/like')

require.cache['/Users/kzz555/Documents/one_punch/models/mongo/user.js']
  = require.cache['/Users/kzz555/Documents/one_punch/mocks/user.js']

require.cache['/Users/kzz555/Documents/one_punch/models/mongo/topic.js']
  = require.cache['/Users/kzz555/Documents/one_punch/mocks/topic.js']

require.cache['/Users/kzz555/Documents/one_punch/models/mongo/points_op.js']
  = require.cache['/Users/kzz555/Documents/one_punch/mocks/points_op.js']

require.cache['/Users/kzz555/Documents/one_punch/models/mongo/like.js']
  = require.cache['/Users/kzz555/Documents/one_punch/mocks/like.js']

const LikeService = require('../../services/like_service')
const {expect, should} = require('chai')
const sinon = require('sinon')
const {ObjectId} = require('mongoose').Types

describe('LikeService#likeTopic()', async () => {

  let userId = (new ObjectId()).toString()

  let attachedId = (new ObjectId()).toString()

  let mockUser
  let mockTopic
  let mockPointsOps
  let mockLike

  beforeEach(async () => {
    mockUser = sinon.mock(User)
    mockTopic = sinon.mock(Topic)
    mockPointsOps = sinon.mock(PointsOp)
    mockLike = sinon.mock(Like)
  })

  afterEach(async () => {
    mockUser.restore()
    mockTopic.restore()
    mockPointsOps.restore()
    mockLike.restore()
  })

  it('should call user.incrPoints with an valid object id', async () => {
    let expect = mockUser.expects('incrPoints').withArgs(ObjectId(userId), 10)
    await LikeService.likeTopic(userId, attachedId)
    expect.verify()
  })

  it('should throw an error when invalid userId passed', async () => {

    await LikeService.likeTopic('asgasdfd', attachedId)
      .catch(e => {
        expect(e).not.to.be.undefined
      })
  })

  it('should call user.incrPoints when topic liked', async () => {
    let expect = mockUser.expects('incrPoints').once()
    await LikeService.likeTopic(userId, attachedId)
    expect.verify()
  })

  it('should call user.incrPoints with points of 10', async () => {
    let expect = mockUser.expects('incrPoints').withArgs(ObjectId(userId), 10)
    await LikeService.likeTopic(userId, attachedId)
    expect.verify()
  })

  it('should call Topic.likeATopic() with right args once', async () => {
    mockTopic.expects('likeATopic').once().withArgs(attachedId)
    await LikeService.likeTopic(userId, attachedId)
    mockTopic.verify()
  })

  it('should call PointsOp.createPointsOp() once', async () => {
    mockPointsOps.expects('createPointsOp').once()
    await LikeService.likeTopic(userId, attachedId)
    mockPointsOps.verify()
  })

  it('should call PointsOp.createPointsOp() with valid objectId-userId', async () => {
    mockPointsOps.expects('createPointsOp').withArgs(ObjectId(userId), PointsOp.POINTS_OP_TYPES.LIKE, 10)
    await LikeService.likeTopic(userId, attachedId)
    mockPointsOps.verify()
  })

  it('should call Like.like() with valid objectId-userId, type and attachedId', async () => {
    mockLike.expects('like').withArgs(ObjectId(userId), ObjectId(attachedId), Like.LIKE_TYPES.TOPIC)
    await LikeService.likeTopic(userId, attachedId)
    mockLike.verify()
  })

  it('should return true if successfully called', async () => {
    const result = await LikeService.likeTopic(userId, attachedId)
    expect(result).to.be.true
  })

})

