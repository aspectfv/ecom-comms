const Item = require('../models/Item');

// Get inventory for staff
exports.getInventory = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search inventory
exports.searchInventory = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const items = await Item.find({
      $or: [
        { itemCode: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { owner: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};