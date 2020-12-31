const mongoose = require('mongoose');

const codeSchema = mongoose.Schema(
  {
    productCode: {
      type: Number,
    },
    receiptCode: {
      type: Number,
    },
    supplierCode: {
      type: Number,
    },
    createdBy: {
      type: String,
    },
    modifiedBy: {
      type: String,
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

module.exports = mongoose.model('Code', codeSchema);
