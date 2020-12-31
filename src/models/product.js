const mongoose = require('mongoose');
const { IMG_DEFAULT_BASE64 } = require('../constants');
const autoIncrement = require('mongoose-auto-increment');
const productSchema = mongoose.Schema(
  {
    createdBy: {
      type: String,
    },
    modifiedBy: {
      type: String,
    },
    options: {
      type: Map,
      of: String,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: IMG_DEFAULT_BASE64,
    },
    PCode: {
      type: Number,
      unique: [true, 'PCode đã bị trùng'],
      dropDups: true,
      get: (v) => `P${v}`,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    categoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category',
    },
    productReceiptIds: [
      { type: mongoose.SchemaTypes.ObjectId, ref: 'ProductReceipt' },
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
productSchema.plugin(autoIncrement.plugin, {
  model: 'Product',
  field: 'PCode',
  startAt: 0,
  incrementBy: 1,
});
module.exports = mongoose.model('Product', productSchema);
