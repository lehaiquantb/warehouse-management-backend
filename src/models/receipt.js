const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const receiptSchema = mongoose.Schema(
  {
    createdBy: {
      type: String,
    },
    modifiedBy: {
      type: String,
    },
    RCode: {
      type: String,
    },
    note: {
      type: String,
    },
    stockStatus: {
      type: String,
      enum: ['DONE', 'NOT_YET'],
      default: 'NOT_YET',
    },
    tag: {
      type: String,
    },
    totalMoney: {
      type: Number,
    },
    supplierId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Supplier',
    },
    paymentIds: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Payment' }],
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
receiptSchema.plugin(autoIncrement.plugin, {
  model: 'Receipt',
  field: 'RCode',
  startAt: 0,
  incrementBy: 1,
});
module.exports = mongoose.model('Receipt', receiptSchema);
