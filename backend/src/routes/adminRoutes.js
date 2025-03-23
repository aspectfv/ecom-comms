const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../utils/auth');

router.get('/inventory', authenticate, authorize(['admin']), adminController.getInventory);
router.get('/sales', authenticate, authorize(['admin']), adminController.getSales);

module.exports = router;