const mongoose = require('mongoose');
const { IMG_DEFAULT_BASE64 } = require('../constants');
const autoIncrement = require('mongoose-auto-increment');
const productSchema = mongoose.Schema(
  {
    createdBy: {
      type: String,
      default: '',
    },
    modifiedBy: {
      type: String,
      default: '',
    },
    options: [
      {
        name: {
          type: String,
        },
        value: {
          type: String,
        },
      },
    ],

    name: {
      type: String,
      required: [true, 'Tên sản phẩm không được để trống'],
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Giá sản phẩm không được để trống'],
    },
    traceCostPrices: [
      {
        date: {
          type: Date,
          default: Date.now(),
        },
        value: {
          type: Number,
        },
      },
    ],
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: IMG_DEFAULT_BASE64,
    },
    listImage: [{ type: String }],
    vendor: {
      type: String,
      default: '',
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
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category',
    },
    productReceipts: [
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
productSchema.index({ name: 'text' });
module.exports = mongoose.model('Product', productSchema);
