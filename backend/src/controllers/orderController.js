const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Item = require('../models/Item');
const Sales = require('../models/Sales');
const generateOrderNumber = require('../utils/orderNumberGenerator'); // Import the utility

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { 
      deliveryDetails, 
      paymentMethod 
    } = req.body;
    
    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.itemId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Calculate totals
    const orderItems = cart.items.map(item => ({
      itemId: item.itemId._id,
      quantity: item.quantity,
      price: item.itemId.price
    }));
    
    const subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal; // Add shipping costs or taxes if needed
    
    // Create order
    const order = new Order({
      orderNumber: generateOrderNumber(), // Use the utility function
      userId: req.user.id,
      items: orderItems,
      deliveryDetails,
      paymentMethod,
      subtotal,
      total,
      status: 'pending',
      createdAt: Date.now()
    });
    
    await order.save();
    
    // Clear user's cart
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.itemId');
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.itemId')
      .populate('userId', 'fullName email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id).populate('items.itemId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update status
    order.status = status;
    
    // If marking as completed, add completion date
    if (status === 'completed') {
      order.completedAt = Date.now();
      
      // Create sales records for each item in the order
      const salesPromises = order.items.map(item => {
        return new Sales({
          orderId: order._id,
          itemCode: item.itemId.itemCode,
          itemName: item.itemId.name,
          owner: item.itemId.owner,
          price: item.price,
          completedAt: order.completedAt,
          total: item.price * item.quantity
        }).save();
      });
      
      await Promise.all(salesPromises);
    }
    
    await order.save();
    
    res.json({
      message: `Order marked as ${status}`,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};