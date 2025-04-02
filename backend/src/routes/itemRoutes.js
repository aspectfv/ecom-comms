const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authenticate, authorize } = require('../utils/auth');

// Public routes
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);

// Protected routes
router.post('/', authenticate, authorize(['staff', 'admin']), itemController.createItem);
router.put('/:id', authenticate, itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
