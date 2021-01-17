const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    createdBy: {
      type: String,
      default: '',
    },
    modifiedBy: {
      type: String,
      default: '',
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'BANK', 'CASH'],
      default: 'CASH',
    },
    status: {
      type: String,
      enum: ['DONE', 'NOT_YET'],
      default: 'NOT_YET',
    },
    paidMoney: {
      type: Number,
      default: 0,
    },
    receipt: {
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
