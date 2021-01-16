const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      dropDups: true,
      validate: {
        validator: (v) => /\S+@\S+\.\S+/.test(v),
        message: (props) => `${props.value} không phải định dạng email hợp lệ`,
      },
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
      required: [true, ''],
      enum: ['male', 'female'],
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
  },
  {
    timestamps: true,
  },
);

// userSchema.pre('save', async function (next) {
//   // Hash the password before saving the user model
//   const user = this
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8)
//   }
//   next()
// })
autoIncrement.initialize(mongoose.connection);
module.exports = mongoose.model('User', userSchema);
