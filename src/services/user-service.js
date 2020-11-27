const bcrypt = require('bcrypt');
const User = require('../models/user');
const { SALTROUNDS } = process.env;

const { use } = require('../routes/news');
const getProfiles = async (email) => {
  try {
    const user = await User.findOne({ email }).select([
      'name',
      'Id',
      'gender',
      'avatar',
      'role',
      'email',
    ]);
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserInform = async (Id) => {
  const user = await User.findOne({ Id }).select([
    'name',
    'Id',
    'gender',
    'avatar',
    'role',
    'email',
  ]);
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({}).select(['name', 'email', 'role']);
  return users;
};

const createUser = async (user) => {
  //debugger
  let bcryptPass = await bcrypt.hash(
    user.password,
    Number.parseInt(SALTROUNDS),
  );
  user.password = bcryptPass;
  const newUser = new User(user);
  const promiseSaveUser = await newUser.save();
  return promiseSaveUser;
};

module.exports = { getUserInform, getAllUsers, createUser, getProfiles };
