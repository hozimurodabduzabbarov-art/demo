const express = require('express');

const authRoute = require('../routes/authRoute');
const userRoute = require('../routes/userRoute');
const categoryRoute = require('../routes/categoryRoute');
const productRoute = require('../routes/productRoute');
const orderRoute = require('../routes/orderRoute');
const resaleRoute = require('../routes/resaleRoute');
const adminRoute = require('../routes/adminRoute');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/categories', categoryRoute);
router.use('/products', productRoute);
router.use('/orders', orderRoute);
router.use('/resale', resaleRoute);
router.use('/admin', adminRoute);

module.exports = router;
