const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { authenticate, authorize } = require('../utils/auth');

router.get('/', authenticate, authorize(['admin']), salesController.getAllSales);
router.get('/filter', authenticate, authorize(['admin']), salesController.filterSales);

module.exports = router;