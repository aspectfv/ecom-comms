const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    quantity: { type: Number, required: true },
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
    referenceNumber: { type: String },
    paymentDate: { type: Date },
    verified: { type: Boolean, default: false }
  },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'out_for_delivery', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  outForDeliveryAt: { type: Date },
  completedAt: { type: Date }
}, {
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
            return ret
        },
    },
})

// Update pre-save middleware to handle outForDeliveryAt date
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
    
    // Prevent setting outForDeliveryAt for pickup orders
    if (this.isModified('outForDeliveryAt') && this.deliveryDetails.mode === 'pickup') {
        const error = new Error('Cannot set outForDeliveryAt for pickup orders');
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
    
    next();
});

module.exports = mongoose.model('Order', OrderSchema);