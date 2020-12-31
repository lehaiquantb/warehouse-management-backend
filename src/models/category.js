const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    modifiedBy: {
      type: String,
    },
    productIds: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Product' }],
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

module.exports = mongoose.model('Category', categorySchema);
