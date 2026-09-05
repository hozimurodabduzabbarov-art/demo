const express = require('express');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  reviewListing,
  getPendingListings,
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/orders', getAllOrders);

router.get('/resale', getPendingListings);
router.put('/resale/:id/review', reviewListing);

module.exports = router;
