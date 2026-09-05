const express = require('express');
const User = require('../models/userModel');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.put('/preferences', protect, async (req, res, next) => {
  try {
    const { preferredLanguage, preferredCurrency } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferredLanguage, preferredCurrency },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
