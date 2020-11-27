const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
  // id: {
  //   type: String,
  //   required: true
  // },
  gender: {
    type: String,
    required: true,
  },
  accessTokens: [
    {
      type: String,
      required: false,
    },
  ],
  refreshTokens: [
    {
      type: String,
      required: false,
    },
  ],
});

// userSchema.pre('save', async function (next) {
//   // Hash the password before saving the user model
//   const user = this
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8)
//   }
//   next()
// })

module.exports = mongoose.model('User', userSchema);
