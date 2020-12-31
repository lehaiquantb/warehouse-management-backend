const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../errors/arror-handler');
const CustomError = require('../errors/custom-error');
const User = require('../models/user');
const { SALTROUNDS } = process.env;

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

const createUser = async (user, req, res) => {
  //debugger\
  let bcryptPass = await bcrypt.hash(
    user.password,
    Number.parseInt(SALTROUNDS),
  );
  user.password = bcryptPass;
  const newUser = new User(user);
  try {
    const promiseSaveUser = await newUser.save();
    return promiseSaveUser;
  } catch (error) {
    debugger;
    handleError(new CustomError(StatusCodes.BAD_REQUEST, error.message), res);
  }

  // const promiseSaveUser = await newUser.save((err)=>{
  //   debugger
  //   throw new Error();
  // });
  //return promiseSaveUser;
};

module.exports = { getUserInform, getAllUsers, createUser, getProfiles };
