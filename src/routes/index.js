const userRouter = require('./user-route');
//Luôn nhớ đặt route theo thứ tự từ dài đến ngắn
const route = (app) => {
  app.use('/user', userRouter);
};

module.exports = route;
