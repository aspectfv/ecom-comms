const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../utils/auth');

router.post('/', authenticate, orderController.createOrder);
router.get('/user', authenticate, orderController.getUserOrders);
router.get('/:id', authenticate, orderController.getOrderById);

router.get('/', authenticate, authorize(['admin']), orderController.getAllOrders);
router.put('/:id', authenticate, authorize(['admin']), orderController.updateOrder);

module.exports = router;