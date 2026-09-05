const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const ResaleListing = require('../models/resaleListingModel');

async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Товар удалён' });
  } catch (err) {
    next(err);
  }
}

async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find().populate('user', 'fullName phone').sort('-createdAt');
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// Модерация витрины перепродажи — одобрить/отклонить лот
async function reviewListing(req, res, next) {
  try {
    const { decision } = req.body; // 'listed' | 'rejected'
    const listing = await ResaleListing.findByIdAndUpdate(
      req.params.id,
      { status: decision },
      { new: true }
    );
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

async function getPendingListings(req, res, next) {
  try {
    const listings = await ResaleListing.find({ status: 'pending_review' })
      .populate('product')
      .populate('seller', 'fullName phone');
    res.json(listings);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  reviewListing,
  getPendingListings,
};
