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
        const { itemId, userId } = req.body;

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
                items: [{ itemId }]
            });
        } else {

            // Check if item already in cart
            const itemIndex = cart.items.findIndex(item => item.itemId.toString() === itemId);
            if (itemIndex <= -1) {
                cart.items.push({ itemId });
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
