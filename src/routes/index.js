const newsRouter = require('./news');
const siteRouter = require('./site');
const coursesRouter = require('./courses');

//Luôn nhớ đặt route theo thứ tự từ dài đến ngắn
const route = (app) => {
  app.use('/news', newsRouter);
  app.use('/courses', coursesRouter);
  app.use('/', siteRouter);
};

module.exports = route;
