const mongoose = require('mongoose');

// Вариант упаковки/цвета одного и того же препарата (например белая пачка / синяя пачка)
const variantSchema = new mongoose.Schema(
  {
    color: String,          // 'orange' | 'blue' ...
    packageImage: String,
    accentBackground: String, // hex, меняет фон карточки товара при выборе
    stock: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { ru: String, uz: String, en: String },
    description: { ru: String, uz: String, en: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    dosage: String, // '500 мг'
    unitCount: Number, // 20 таблеток
    priceUZS: { type: Number, required: true }, // базовая цена хранится в сумах
    oldPriceUZS: Number,
    stock: { type: Number, default: 0 },
    isRare: { type: Boolean, default: false }, // дефицитный препарат -> доступен предзаказ
    prescriptionRequired: { type: Boolean, default: false },
    images: [String],
    variants: [variantSchema],
    rating: { type: Number, default: 4.8 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
