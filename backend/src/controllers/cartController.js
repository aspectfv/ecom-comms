const Cart = require('../models/Cart');
const Item = require('../models/Item');

// Get user cart
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id }).populate('items.itemId');

        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { itemId, quantity = 1, userId } = req.body;

        // Validate item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        let cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            // Create new cart if it doesn't exist
            cart = new Cart({
                userId: userId,
                items: [{ itemId, quantity }]
            });
        } else {
            // Check if item already in cart
            const itemIndex = cart.items.findIndex(item => item.itemId.toString() === itemId);

            if (itemIndex > -1) {
                // Item exists, update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                cart.items.push({ itemId, quantity });
            }
        }

        cart.updatedAt = Date.now();
        await cart.save();

        // Populate item details
        const populatedCart = await Cart.findById(cart._id).populate('items.itemId');

        res.json(populatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        console.log("FIRST ITEM IN THE CART")
        console.log(cart.items[0].itemId.toString())
        console.log("REQ PARAMS ITEMID")
        console.log(req.params.itemId)
        cart.items = cart.items.filter(item => item.itemId.toString() !== req.params.itemId);
        cart.updatedAt = Date.now();

        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('items.itemId');

        res.json(populatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.itemId.toString() === req.params.itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = quantity;
        cart.updatedAt = Date.now();

        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('items.itemId');

        res.json(populatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
