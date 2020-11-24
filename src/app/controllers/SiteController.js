const Course = require('../models/Course');

const {
  mutilpleMongooseToObject,
  mongooseToOject,
} = require('../../util/mongoose');

class SiteController {
  // index(req, res) {
  //     res.render('home');
  // }
  show(req, res, next) {
    Course.find({}, (err, courses) => {
      if (!err) {
        res.json(courses);
      } else res.status(400).json({ error: 'errrr' });
    });
    // Course.find({})
    //   .then((courses) => {
    //     courses = mutilpleMongooseToObject(courses); //course trong mongoose không phải là 1 object thuần
    //     res.render('home', {
    //       courses,
    //     });
    //     //render này chỉ thuộc server side rendering
    //   })
    //   .catch(next);
  }
}

module.exports = new SiteController();
