const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên danh mục không được trống'],
      unique: true,
      dropDups: true,
    },
    createdBy: {
      type: String,
      default: '',
    },
    modifiedBy: {
      type: String,
      default: '',
    },
    products: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Product' }],
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
