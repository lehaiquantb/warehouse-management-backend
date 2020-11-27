const newsRouter = require('./news');
const siteRouter = require('./site');
const coursesRouter = require('./courses');

const userRouter = require('./user-route');
//Luôn nhớ đặt route theo thứ tự từ dài đến ngắn
const route = (app) => {
  app.use('/news', newsRouter);
  app.use('/user', userRouter);
  app.use('/courses', coursesRouter);
  app.use('/', siteRouter);
};

module.exports = route;
