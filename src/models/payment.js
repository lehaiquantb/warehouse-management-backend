const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    createdBy: {
      type: String,
    },
    modifiedBy: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'BANK', 'CASH'],
      default: 'CASH',
    },
    paymentStatus: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    paidMoney: {
      type: Number,
      default: 0,
    },
    receiptId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Receipt',
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

module.exports = mongoose.model('Payment', paymentSchema);
