const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Item = require('../models/Item');
const generateOrderNumber = require('../utils/orderNumberGenerator'); // Import the utility

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('items.itemId')
            .populate('userId', 'fullName email');

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const {
            deliveryDetails,
            paymentMethod,
            paymentDetails
        } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.itemId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate totals
        const orderItems = cart.items.map(item => ({
            itemId: item.itemId._id,
            price: item.itemId.price
        }));

        const subtotal = orderItems.reduce((total, item) => total + (item.price), 0);
        const total = subtotal; // Add shipping costs or taxes if needed

        // Create order object with all required fields
        const orderData = {
            orderNumber: generateOrderNumber(),
            userId: req.user.id,
            items: orderItems,
            deliveryDetails,
            paymentMethod,
            subtotal,
            total,
            status: 'pending',
            createdAt: Date.now()
        };

        // Add payment details if they exist
        if (paymentDetails) {
            orderData.paymentDetails = paymentDetails;
        }

        // Create and save the order
        const order = new Order(orderData);
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
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};
