const mongoose = require('mongoose');

const productReceiptSchema = mongoose.Schema(
  {
    createdBy: {
      type: String,
    },
    modifiedBy: {
      type: String,
    },
    costPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    quantityPerProduct: {
      type: Number,
      required: true,
    },
    productId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Product',
      required: true,
    },
    receiptId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Receipt',
      required: true,
    },
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

module.exports = mongoose.model('ProductReceipt', productReceiptSchema);
