const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin', 'courier'], default: 'user' },
    preferredLanguage: { type: String, enum: ['ru', 'uz', 'en'], default: 'ru' },
    preferredCurrency: { type: String, enum: ['RUB', 'UZS', 'USD'], default: 'UZS' },
    balance: { type: Number, default: 0 }, // накопления от перепродажи лекарств
    addresses: [
      {
        label: String,
        city: String,
        street: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
