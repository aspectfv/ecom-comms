const Item = require('../models/Item');
const Sales = require('../models/Sales');
const Order = require('../models/Order');

// Get inventory for admin
exports.getInventory = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get sales for admin
exports.getSales = async (req, res) => {
  try {
    const sales = await Sales.find()
      .sort({ completedAt: -1 })
      .populate({
        path: 'orderId',
        select: 'orderNumber userId status createdAt completedAt',
        populate: { path: 'userId', select: 'fullName email' }
      });
    
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders with pagination
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'fullName email')
      .populate('items.itemId');
    
    const total = await Order.countDocuments();
    
    res.json({
      orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};