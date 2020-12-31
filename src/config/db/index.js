const mongoose = require('mongoose');
const { MONGO_URI } = process.env;

const connect = async () => {
  try {
    await mongoose.connect(`${MONGO_URI}`, {
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
