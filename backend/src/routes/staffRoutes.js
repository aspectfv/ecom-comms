const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticate, authorize } = require('../utils/auth');

router.get('/inventory', authenticate, authorize(['staff', 'admin']), staffController.getInventory);

module.exports = router;