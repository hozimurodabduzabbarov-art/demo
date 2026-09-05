const mongoose = require('mongoose');

// Лот перепродажи: пользователь купил дорогой/редкий препарат и не вскрыл его,
// теперь перепродаёт через маркетплейс аптеки с наценкой, ограниченной maxMarkupPercent.
const resaleListingSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    originalOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    purchasePriceUZS: { type: Number, required: true },
    resalePriceUZS: { type: Number, required: true }, // <= purchasePrice * (1 + maxMarkupPercent/100)
    maxMarkupPercent: { type: Number, default: 30 },
    commissionPercent: { type: Number, default: 15 }, // 10-20%, удерживает аптека
    expiryDate: Date,
    status: {
      type: String,
      enum: ['pending_review', 'listed', 'sold', 'rejected', 'cancelled'],
      default: 'pending_review',
    },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ResaleListing', resaleListingSchema);
