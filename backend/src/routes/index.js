const express = require('express');
const { authenticate, authorize } = require('../utils/auth');

const adminRoutes = require('./adminRoutes');
const authRoutes = require('./authRoutes');
const cartRoutes = require('./cartRoutes');
const itemRoutes = require('./itemRoutes');
const orderRoutes = require('./orderRoutes');
const salesRoutes = require('./salesRoutes');
const staffRoutes = require('./staffRoutes');

const router = express.Router();

router.use('/admin', authenticate, authorize(['admin']), adminRoutes);
router.use('/auth', authRoutes);
router.use('/cart', authenticate, cartRoutes);
router.use('/items', itemRoutes);
router.use('/orders', authenticate, orderRoutes);
router.use('/sales', authenticate, authorize(['admin']), salesRoutes);
router.use('/staff', authenticate, authorize(['staff', 'admin']), staffRoutes);

module.exports = router;