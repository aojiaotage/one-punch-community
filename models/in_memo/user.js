let USER_ID_INIT = 10000;
const users = [];

class User {
  constructor(params) {
    if (!params.name || !params.age) throw new Error('age and name required when creating a user!');
    this.name = params.name;
    this.age = params.age;
    this._id = USER_ID_INIT++;
  }
}

async function createANewUser(params) {
  const user =  new User(params);
  users.push(user);
  return user;
}

async function getUsers(params){
  return users;
};

async function getUserById(userId){
  return users.find(u=>u._id === Number(userId));
}

async function updateUserById(userId, update){
  const user = users.find(u=>u._id === userId);
  if(update.name) user.name = update.name;
  if(update.age) user.age = update.age;
};

module.exports = {
  model: User,
  createANewUser,
  getUsers,
  getUserById,
  updateUserById,
};
