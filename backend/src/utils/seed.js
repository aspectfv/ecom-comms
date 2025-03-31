// seeds.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const generateOrderNumber = require('./orderNumberGenerator');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Seed data
const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Item.deleteMany({});
        await Cart.deleteMany({});
        await Order.deleteMany({});

        console.log('Database cleared');

        // Create users
        const admin = await User.create({
            email: 'admin@mercafinds.com',
            password: 'password123',
            fullName: 'Admin User',
            contactNumber: '123-456-7890',
            address: {
                street: '123 Admin St',
                city: 'Admin City'
            },
            role: 'admin'
        });

        const staff = await User.create({
            email: 'staff@mercafinds.com',
            password: 'password123',
            fullName: 'Staff User',
            contactNumber: '123-456-7891',
            address: {
                street: '123 Staff St',
                city: 'Staff City'
            },
            role: 'staff'
        });

        const customer1 = await User.create({
            email: 'customer1@example.com',
            password: 'password123',
            fullName: 'John Doe',
            contactNumber: '123-456-7892',
            address: {
                street: '123 Customer St',
                city: 'Customer City'
            },
            role: 'customer'
        });

        const customer2 = await User.create({
            email: 'customer2@example.com',
            password: 'password123',
            fullName: 'Jane Smith',
            contactNumber: '123-456-7893',
            address: {
                street: '456 Customer Ave',
                city: 'Customer Town'
            },
            role: 'customer'
        });

        console.log('Users created');

        // Create items sequentially instead of with insertMany
        console.log('Creating items...');
        const itemsData = [
            {
                name: 'Vintage Leather Jacket',
                price: 89.99,
                owner: 'Jane Collector',
                type: 'preloved',
                category: 'Clothing',
                description: 'A beautiful vintage leather jacket from the 90s.',
                condition: 'Minor wear on sleeves',
                images: ['images/jacket1.jpg', 'images/jacket2.jpg'],
                createdBy: admin._id
            },
            {
                name: 'Antique Coffee Table',
                price: 199.99,
                owner: 'Vintage Homes',
                type: 'preloved',
                category: 'Furniture',
                description: 'Solid wood antique coffee table with intricate carvings.',
                condition: 'Some scratches on surface',
                images: ['images/table1.jpg', 'images/table2.jpg'],
                createdBy: staff._id
            },
            {
                name: 'Retro Polaroid Camera',
                price: 59.99,
                owner: 'Camera Collectors',
                type: 'preloved',
                category: 'Electronics',
                description: 'Functioning Polaroid camera from the 70s.',
                condition: 'Excellent working condition',
                images: ['images/camera1.jpg', 'images/camera2.jpg'],
                createdBy: admin._id
            },
            {
                name: 'Modern Desk Lamp',
                price: 34.99,
                owner: 'Home Essentials',
                type: 'brandnew',
                category: 'Home Decor',
                description: 'Sleek, modern desk lamp with adjustable brightness.',
                condition: 'New',
                images: ['images/lamp1.jpg', 'images/lamp2.jpg'],
                createdBy: staff._id
            },
            {
                name: 'Wireless Headphones',
                price: 129.99,
                owner: 'Tech World',
                type: 'brandnew',
                category: 'Electronics',
                description: 'High-quality wireless headphones with noise cancellation.',
                condition: 'New',
                images: ['images/headphones1.jpg', 'images/headphones2.jpg'],
                createdBy: admin._id
            },
            {
                name: 'Ceramic Plant Pot',
                price: 19.99,
                owner: 'Green Thumb',
                type: 'brandnew',
                category: 'Home Decor',
                description: 'Handcrafted ceramic pot for indoor plants.',
                condition: 'New',
                images: ['images/pot1.jpg', 'images/pot2.jpg'],
                createdBy: staff._id
            }
        ];

        // Create each item individually to trigger pre-save hooks
        const items = [];
        for (const itemData of itemsData) {
            const item = await Item.create(itemData);
            items.push(item);
            console.log(`Created item: ${item.name} with code: ${item.itemCode}`);
        }

        console.log('Items created');

        // Create cart for customer1
        const cart1 = await Cart.create({
            userId: customer1._id,
            items: [
                {
                    itemId: items[0]._id,
                    quantity: 1
                },
                {
                    itemId: items[3]._id,
                    quantity: 2
                }
            ],
            updatedAt: Date.now()
        });

        // Create cart for customer2
        const cart2 = await Cart.create({
            userId: customer2._id,
            items: [
                {
                    itemId: items[2]._id,
                    quantity: 1
                }
            ],
            updatedAt: Date.now()
        });

        console.log('Carts created');

        // Create completed order for customer1
        const order1 = await Order.create({
            orderNumber: generateOrderNumber(),
            userId: customer1._id,
            items: [
                {
                    itemId: items[1]._id,
                    quantity: 1,
                    price: items[1].price
                },
                {
                    itemId: items[4]._id,
                    quantity: 1,
                    price: items[4].price
                }
            ],
            deliveryDetails: {
                fullName: customer1.fullName,
                contactNumber: customer1.contactNumber,
                street: customer1.address.street,
                city: customer1.address.city,
                mode: 'delivery',
                date: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next day delivery
            },
            paymentMethod: 'e-wallet',
            subtotal: items[1].price + items[4].price,
            total: items[1].price + items[4].price,
            status: 'completed',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        });

        // Create pending order for customer2
        const order2 = await Order.create({
            orderNumber: generateOrderNumber(),
            userId: customer2._id,
            items: [
                {
                    itemId: items[3]._id,
                    quantity: 1,
                    price: items[3].price
                }
            ],
            deliveryDetails: {
                fullName: customer2.fullName,
                contactNumber: customer2.contactNumber,
                street: customer2.address.street,
                city: customer2.address.city,
                mode: 'pickup',
                date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
            },
            paymentMethod: 'cash',
            subtotal: items[3].price,
            total: items[3].price,
            status: 'pending',
            createdAt: Date.now()
        });

        console.log('Orders created');

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeding function
seedDatabase();
