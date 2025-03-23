const Sales = require('../models/Sales');

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find()
      .sort({ completedAt: -1 })
      .populate('orderId');
    
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Filter sales by various parameters
exports.filterSales = async (req, res) => {
  try {
    const { itemCode, itemName, owner, startDate, endDate } = req.query;
    
    // Build query
    const query = {};
    
    if (itemCode) query.itemCode = itemCode;
    if (itemName) query.itemName = { $regex: itemName, $options: 'i' };
    if (owner) query.owner = owner;
    
    // Date filter
    if (startDate || endDate) {
      query.completedAt = {};
      if (startDate) query.completedAt.$gte = new Date(startDate);
      if (endDate) query.completedAt.$lte = new Date(endDate);
    }
    
    const sales = await Sales.find(query)
      .sort({ completedAt: -1 })
      .populate('orderId');
    
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};