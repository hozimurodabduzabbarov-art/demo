const Order = require('../models/orderModel');
const Product = require('../models/productModel');

async function createOrder(req, res, next) {
  try {
    const { items, deliveryAddress, currency, prescriptionFileUrl } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Корзина пуста' });
    }

    let totalUZS = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      totalUZS += product.priceUZS * item.quantity;
      orderItems.push({
        product: product._id,
        variantColor: item.variantColor || 'default',
        quantity: item.quantity,
        priceUZS: product.priceUZS,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalUZS,
      currency: currency || 'UZS',
      deliveryAddress,
      prescriptionFileUrl,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getMyOrders };
