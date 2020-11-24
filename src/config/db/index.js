const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/f8_education_dev', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('[DATABASE] Connect succesfully !');
  } catch (error) {
    console.log('[DATABASE] Connect failure !');
  }
};

module.exports = { connect };
