const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authenticate, authorize } = require('../utils/auth');

// Public routes
router.get('/', authenticate, itemController.getAllItems);
router.get('/:id', authenticate, itemController.getItemById);

// Protected routes
router.post('/', authenticate, authorize(['staff', 'admin']), itemController.createItem);
router.put('/:id', authenticate, authorize(['staff', 'admin']), itemController.updateItem);
router.delete('/:id', authenticate, authorize(['staff', 'admin']), itemController.deleteItem);

module.exports = router;