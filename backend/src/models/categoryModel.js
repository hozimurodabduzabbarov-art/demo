const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      ru: String,
      uz: String,
      en: String,
    },
    slug: { type: String, required: true, unique: true },
    icon: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
