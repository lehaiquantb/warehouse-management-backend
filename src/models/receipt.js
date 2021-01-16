const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const receiptSchema = mongoose.Schema(
  {
    createdBy: {
      type: String,
      default: '',
    },
    modifiedBy: {
      type: String,
      default: '',
    },
    RCode: {
      type: String,
      unique: [true, 'RCode đã bị trùng'],
      dropDups: true,
    },
    note: {
      type: String,
      default: '',
    },
    stockStatus: {
      type: String,
      enum: ['DONE', 'NOT_YET'],
      default: 'NOT_YET',
    },
    paymentStatus: {
      type: String,
      enum: ['DONE', 'NOT_YET', 'PARTIAL'],
      default: 'NOT_YET',
    },
    tags: [
      {
        type: String,
        default: '',
      },
    ],
    deliveryAddress: {
      type: String,
      default: '',
    },
    totalMoney: {
      type: Number,
      required: [true, 'Tổng số tiền không được trống'],
    },
    supplier: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Supplier',
    },
    payments: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Payment' }],
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
receiptSchema.plugin(autoIncrement.plugin, {
  model: 'Receipt',
  field: 'RCode',
  startAt: 0,
  incrementBy: 1,
});
// receiptSchema.index({ name: 'text' });
module.exports = mongoose.model('Receipt', receiptSchema);
