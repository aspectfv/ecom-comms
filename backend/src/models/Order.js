const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    // Replace reference with embedded document containing all item details
    itemDetails: {
      originalItemId: { type: Schema.Types.ObjectId, ref: 'Item' }, // Keep original ID for reference
      itemCode: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      owner: { type: String, required: true },
      type: { type: String, required: true },
      category: { type: String, required: true },
      description: { type: String },
      condition: { type: String },
      images: [{ type: String }]
    },
    price: { type: Number, required: true }
  }],
  deliveryDetails: {
    fullName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    mode: { type: String, enum: ['pickup', 'delivery'], required: true },
    date: { type: Date, required: true }
  },
  paymentMethod: { type: String, enum: ['e-wallet', 'bank-transfer', 'cash'], required: true },
  paymentDetails: {
    proofImage: { type: String },
    paymentDate: { type: Date },
  },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'out_for_delivery', 'ready_for_pickup', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  outForDeliveryAt: { type: Date },
  readyForPickupAt: { type: Date },
  completedAt: { type: Date }
}, {
    toJSON: {
        transform: function(doc, ret) {
            // Transform ID field
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            
            // Transform image URLs in all item details
            if (ret.items && ret.items.length > 0) {
                const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
                
                ret.items.forEach(item => {
                    if (item.itemDetails && item.itemDetails.images && item.itemDetails.images.length > 0) {
                        item.itemDetails.images = item.itemDetails.images.map(img => {
                            // Only prepend baseUrl if the image path doesn't already include http:// or https://
                            if (img && !img.startsWith('http://') && !img.startsWith('https://')) {
                                // Make sure we don't duplicate slashes
                                const imgPath = img.startsWith('/') ? img : `/${img}`;
                                return `${baseUrl}${imgPath}`;
                            }
                            return img;
                        });
                    }
                });
            }
            
            // Also transform any payment proof image URL if it exists
            if (ret.paymentDetails && ret.paymentDetails.proofImage) {
                const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
                const img = ret.paymentDetails.proofImage;
                
                if (img && !img.startsWith('http://') && !img.startsWith('https://')) {
                    const imgPath = img.startsWith('/') ? img : `/${img}`;
                    ret.paymentDetails.proofImage = `${baseUrl}${imgPath}`;
                }
            }
            
            return ret;
        },
    },
})

// Update pre-save middleware to handle status changes
OrderSchema.pre('save', function(next) {
    // Set completedAt date when status changes to 'completed'
    if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
        this.completedAt = new Date();
    }
    
    // Block out_for_delivery status for pickup orders
    if (this.isModified('status') && this.status === 'out_for_delivery') {
        // Check if this is a pickup order
        if (this.deliveryDetails.mode === 'pickup') {
            const error = new Error('Pickup orders cannot be marked as out for delivery');
            return next(error);
        }
        
        // For delivery orders, set outForDeliveryAt if not already set
        if (!this.outForDeliveryAt) {
            this.outForDeliveryAt = new Date();
        }
    }
    
    // Block ready_for_pickup status for delivery orders
    if (this.isModified('status') && this.status === 'ready_for_pickup') {
        // Check if this is a delivery order
        if (this.deliveryDetails.mode === 'delivery') {
            const error = new Error('Delivery orders cannot be marked as ready for pickup');
            return next(error);
        }
        
        // For pickup orders, set readyForPickupAt if not already set
        if (!this.readyForPickupAt) {
            this.readyForPickupAt = new Date();
        }
    }
    
    // Prevent setting outForDeliveryAt for pickup orders
    if (this.isModified('outForDeliveryAt') && this.deliveryDetails.mode === 'pickup') {
        const error = new Error('Cannot set outForDeliveryAt for pickup orders');
        return next(error);
    }
    
    // Prevent setting readyForPickupAt for delivery orders
    if (this.isModified('readyForPickupAt') && this.deliveryDetails.mode === 'delivery') {
        const error = new Error('Cannot set readyForPickupAt for delivery orders');
        return next(error);
    }
    
    next();
});

// Update middleware for findOneAndUpdate operations
OrderSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();
    
    // If updating to completed status and completedAt isn't set
    if (update.status === 'completed' && !update.completedAt) {
        update.completedAt = new Date();
    }
    
    // If trying to update to out_for_delivery status
    if (update.status === 'out_for_delivery') {
        try {
            // Get the order document to check delivery mode
            const orderId = this.getQuery()._id;
            const order = await mongoose.model('Order').findById(orderId);
            
            // Block out_for_delivery status for pickup orders
            if (order && order.deliveryDetails.mode === 'pickup') {
                const error = new Error('Pickup orders cannot be marked as out for delivery');
                return next(error);
            }
            
            // For delivery orders, set outForDeliveryAt if not already set
            if (!update.outForDeliveryAt) {
                update.outForDeliveryAt = new Date();
            }
        } catch (err) {
            return next(err);
        }
    }
    
    // If trying to update to ready_for_pickup status
    if (update.status === 'ready_for_pickup') {
        try {
            // Get the order document to check delivery mode
            const orderId = this.getQuery()._id;
            const order = await mongoose.model('Order').findById(orderId);
            
            // Block ready_for_pickup status for delivery orders
            if (order && order.deliveryDetails.mode === 'delivery') {
                const error = new Error('Delivery orders cannot be marked as ready for pickup');
                return next(error);
            }
            
            // For pickup orders, set readyForPickupAt if not already set
            if (!update.readyForPickupAt) {
                update.readyForPickupAt = new Date();
            }
        } catch (err) {
            return next(err);
        }
    }
    
    // If trying to update outForDeliveryAt field
    if (update.outForDeliveryAt !== undefined) {
        try {
            // Get the order document to check delivery mode
            const orderId = this.getQuery()._id;
            const order = await mongoose.model('Order').findById(orderId);
            
            // Block setting outForDeliveryAt for pickup orders
            if (order && order.deliveryDetails.mode === 'pickup') {
                const error = new Error('Cannot set outForDeliveryAt for pickup orders');
                return next(error);
            }
        } catch (err) {
            return next(err);
        }
    }
    
    // If trying to update readyForPickupAt field
    if (update.readyForPickupAt !== undefined) {
        try {
            // Get the order document to check delivery mode
            const orderId = this.getQuery()._id;
            const order = await mongoose.model('Order').findById(orderId);
            
            // Block setting readyForPickupAt for delivery orders
            if (order && order.deliveryDetails.mode === 'delivery') {
                const error = new Error('Cannot set readyForPickupAt for delivery orders');
                return next(error);
            }
        } catch (err) {
            return next(err);
        }
    }
    
    next();
});

module.exports = mongoose.model('Order', OrderSchema);
