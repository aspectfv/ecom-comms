const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../utils/auth');

router.get('/', authenticate, cartController.getCart);
router.post('/add', authenticate, cartController.addToCart);
router.delete('/remove/:itemId', authenticate, cartController.removeFromCart);

module.exports = router;
