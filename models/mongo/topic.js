const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReplySchema = new Schema({
  creator: Schema.Types.ObjectId,
  content: String,
  likes: {type: Number, default: 0},
})

const TopicSchema = new Schema({
  creator: {type: String, required: true},
  title: {type: String,},
  content: String,
  replyList: [ReplySchema],
  likes: {type: Number, default: 0},
})

const TopicModel = mongoose.model('topic', TopicSchema)

async function createANewTopic (params) {
  const user = new TopicModel({
    creator: params.creator,
    title: params.age,
    content: params.content,
  })
  return await user.save()
    .catch(e => {
      throw Error(`error creating topic ${ JSON.stringify(params) }`)
    })
}

async function getTopics (params) {
  let flow = TopicModel.find({})
  flow.skip(params.page * params.pageSize)
  flow.limit(params.pageSize)
  return await flow
    .catch(e => {
      console.log(e)
      throw new Error('error getting users from db')
    })
}

async function getTopicById (topicId) {
  return await TopicModel.findOne({_id: topicId})
    .catch(e => {
      console.log(e)
      throw new Error(`error getting user by id: ${topicId}`)
    })
}

async function updateTopicById (topicId, update) {
  return await TopicModel.findOneAndUpdate({_id: userId}, update, {new: true})
    .catch(e => {
      console.log(e)
      throw new Error(`error updating user by id: ${userId}`)
    })
}

async function replyATopic (params) {
  return await TopicModel.findOneAndUpdate(
    {_id: params.topicId},
    {$push: {replyList: {creator: params.creator, content: params.content}}},
    {new: true})
    .catch(e => {
      console.log(e)
      throw new Error(`error replying topic ${JSON.stringify(params)}`)
    })
}

async function likeATopic (topicId) {
  console.log(topicId);
  const topic = await TopicModel.findOneAndUpdate({_id: topicId}, {$inc:{likes:1}}, {new: true, fields: {likes:1}})
  return topic.likes
}

async function dislikeATopic (topicId) {
  const topic = await TopicModel.findOneAndUpdate({_id: topicId}, {$inc:{likes:-1}}, {new: true, fields: {likes:1}})
  return topic.likes
}

async function likeAReply (replyId) {
  const topic = await TopicModel.findOne({"replyList._id": replyId}, {"replyList._id":1,"replyList.likes":1})
  const reply = topic.replyList.find(e=>e._id.toString() === replyId.toString())
  reply.likes ++
  await topic.save()
  return reply.likes
}

async function dislikeAReply (replyId) {
  const topic = await TopicModel.findOne({"replyList._id": replyId}, {"replyList._id":1,"replyList.likes":1})
  const reply = topic.replyList.find(e=>e._id.toString() === replyId.toString())
  reply.likes --
  await topic.save()
  return reply.likes
}

module.exports = {
  model: TopicModel,
  createANewTopic,
  getTopics,
  getTopicById,
  updateTopicById,
  replyATopic,
  likeATopic,
  likeAReply,
  dislikeATopic,
  dislikeAReply,
}
