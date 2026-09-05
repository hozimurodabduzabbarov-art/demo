const express = require('express');
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, adminOnly, createCategory);

module.exports = router;
