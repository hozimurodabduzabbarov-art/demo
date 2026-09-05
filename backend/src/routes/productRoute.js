const express = require('express');
const { getProducts, getProductById, preorderProduct } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/preorder', protect, preorderProduct);

module.exports = router;
