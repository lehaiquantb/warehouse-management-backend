module.exports = {
  mutilpleMongooseToObject: function (m) {
    return m.map((item) => item.toObject());
  },
  mongooseToOject: (m) => {
    return m ? m.toObject() : m;
  },
};
