const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const bluebird = require('bluebird')
const pbkdf2Async = bluebird.promisify(crypto.pbkdf2)
const SALT = require('../../cipher').PASSWORD_SALT
const Errors = require('../../errors')
const logger = require('../../utils/logger').logger

const UserSchema = new Schema({
  name: {type: String, required: true},
  age: {type: Number, max: [90, 'Nobody over 90 could use postman']},
  phoneNumber: String,
  password: String,
  avatar: String,
  openId: {type: String, index: true},
  points: Number,
})

UserSchema.index({name: 1}, {unique: true})

UserSchema.index({name: 1, age: 1})

const DEFAULT_PROJECTION = {password: 0, phoneNumber: 0, __v: 0}

const UserModel = mongoose.model('user', UserSchema)

async function createANewUser (params) {
  const user = new UserModel({name: params.name, age: params.age, phoneNumber: params.phoneNumber, openId: params.openId})

  if(params.password){
    user.password = await pbkdf2Async(params.password, SALT, 512, 128, 'sha1')
      .then(r => r.toString())
      .catch(e => {
        console.log(e)
        throw new Error('something goes wrong inside the server')
      })
  }

  let created = await user.save()
    .catch(e => {
      logger.error('error creating user', e)
      switch (e.code) {
        case 11000:
          throw new Errors.DuplicatedUserNameError(params.name)
          break
        default:
          throw new Errors.ValidationError('user', `error creating user ${ JSON.stringify(params) }`)
          break
      }
    })

  return {
    _id: created._id,
    name: created.name,
    age: created.age,
  }
}

async function getUsers (params = {page: 0, pageSize: 10}) {
  let flow = UserModel.find({})
  flow.select(DEFAULT_PROJECTION)
  flow.skip(params.page * params.pageSize)
  flow.limit(params.pageSize)
  return await flow
    .catch(e => {
      console.log(e)
      throw new Error('error getting users from db')
    })
}

async function getUserById (userId) {
  return await UserModel.findOne({_id: userId})
    .select(DEFAULT_PROJECTION)
    .catch(e => {
      console.log(e)
      throw new Error(`error getting user by id: ${userId}`)
    })
}

async function updateUserById (userId, update) {
  return await UserModel.findOneAndUpdate({_id: userId}, update, {new: true})
    .catch(e => {
      console.log(e)
      throw new Error(`error updating user by id: ${userId}`)
    })
}

async function login (phoneNumber, password) {
  password = await pbkdf2Async(password, SALT, 512, 128, 'sha1')
    .then(r => r.toString())
    .catch(e => {
      console.log(e)
      throw new Errors.InternalError('something goes wrong inside the server')
    })

  const user = await UserModel.findOne({phoneNumber: phoneNumber, password: password})
    .select(DEFAULT_PROJECTION)
    .catch(e=>{
      console.log(`error logging in, phone ${phoneNumber}`, {err:e.stack || e});
      throw new Error('something wrong with the server');
    });

  if(!user) throw Error('No such user!');
  return user;
}

async function loginWithWechat (user) {
  let found = await UserModel.findOne({openId: user.openid})
  if(found) return found

  let created = await createANewUser({name: user.nickname, openId: user.openid})
  return created
}

async function incrPoints (userId, points) {
  const user = await UserModel.findOneAndUpdate({_id: userId},{$inc:{points: points}}, {new: true, fields: {points: 1}})
  return user.points
}

module.exports = {
  model: UserModel,
  createANewUser,
  getUsers,
  getUserById,
  updateUserById,
  login,
  loginWithWechat,
  incrPoints,
}
