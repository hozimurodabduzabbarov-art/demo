const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    variantColor: String,
    quantity: Number,
    priceUZS: Number, // зафиксированная цена на момент покупки
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalUZS: Number,
    currency: { type: String, default: 'UZS' },
    deliveryAddress: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'courier_assigned', 'delivered', 'cancelled'],
      default: 'pending',
    },
    prescriptionFileUrl: String,
    isPreorder: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
