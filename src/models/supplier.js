const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const supplierSchema = mongoose.Schema(
  {
    createdBy: {
      type: String,
      default: '',
    },
    modifiedBy: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Địa chỉ bị thiếu'],
    },
    address2: {
      type: String,
      default: '',
    },
    SCode: {
      type: Number,
      required: true,
      unique: [true, 'SCode đã bị trùng'],
      dropDups: true,
    },
    description: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
      validate: {
        validator: (v) => /\S+@\S+\.\S+/.test(v),
        message: (props) => `${props.value} không phải định dạng email hợp lệ`,
      },
    },
    name: {
      type: String,
      required: [true, 'Tên nhà cung cấp bị thiếu'],
    },
    phone: {
      type: String,
      validate: {
        validator: (v) => /^[0-9]+$/gm.test(v),
        message: (props) =>
          `${props.value} không phải định dạng số điện thoại hợp lệ`,
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    taxCode: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    paid: {
      type: Number,
      default: 0,
    },
    debt: {
      type: Number,
      default: 0,
    },
    receipts: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Receipt' }],
  },
  {
    timestamps: true,
  },
);

function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

// userSchema.pre('save', async function (next) {
//   // Hash the password before saving the user model
//   const user = this
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8)
//   }
//   next()
// })
supplierSchema.plugin(autoIncrement.plugin, {
  model: 'Product',
  field: 'SCode',
  startAt: 0,
  incrementBy: 1,
});
supplierSchema.index({ name: 'text' });
module.exports = mongoose.model('Supplier', supplierSchema);
