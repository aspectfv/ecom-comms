const express = require('express');

const { authenticate, authorize } = require('../utils/auth');

const authRoutes = require('./authRoutes');
const cartRoutes = require('./cartRoutes');
const itemRoutes = require('./itemRoutes');
const orderRoutes = require('./orderRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cart', authenticate, cartRoutes);
router.use('/items', itemRoutes);
router.use('/orders', authenticate, orderRoutes);

module.exports = router;
