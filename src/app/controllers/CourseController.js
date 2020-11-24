const Course = require('../models/Course');

const {
  mutilpleMongooseToObject,
  mongooseToOject,
} = require('../../util/mongoose');

// index(req, res) {
//     res.render('home');
// }
const show = (req, res, next) => {
  //res.json(req.params.slug);
  //slug = req.params.slug
  Course.findOne({ slug: req.params.slug })
    .then((course) => {
      res.render('courses/show', { course: mongooseToOject(course) });
    })
    .catch(next);
  // Course.find({})
  //     .then((courses) => {
  //         courses = mutilpleMongooseToObject(courses); //course trong mongoose không phải là 1 object thuần
  //         res.render('home', {
  //             courses,
  //         });
  //         //render này chỉ thuộc server side rendering
  //     })
  //     .catch(next);
};

const create = (req, res, next) => {
  res.render('courses/create');
};

const store = (req, res, next) => {
  // res.json(req.body);
  const course = new Course(req.body);
  course
    .save()
    .then(() => res.redirect(`/courses/`)) //trả về header location và trình duyệt sẽ redirect đến trang cần
    .catch(next);
  res.send('course saved');
};

module.exports = { show, create, store };
