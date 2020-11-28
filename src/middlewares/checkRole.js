const asyncMiddleware = require('./async');
const CustomError = require('../errors/custom-error');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const User = require('../models/user');

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      console.log(roles);

      return next();
    } catch (err) {
      next(err);
    }
  };
};

// const checkRole = async (roles, req, res, next) => {
//     debugger
// };

// const checkRole = (roles) => async (roles,req, res, next) => {

// }
// ;
module.exports = checkRole;
