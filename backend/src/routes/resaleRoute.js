const express = require('express');
const { createListing, getListings, buyListing } = require('../controllers/resaleController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getListings);
router.post('/', protect, createListing);
router.post('/:id/buy', protect, buyListing);

module.exports = router;
