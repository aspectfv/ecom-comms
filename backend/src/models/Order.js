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
    
    // Set outForDeliveryAt date when status changes to 'out_for_delivery'
    if (this.isModified('status') && this.status === 'out_for_delivery' && !this.outForDeliveryAt) {
        this.outForDeliveryAt = new Date();
    }
    
    next();
});

// Update middleware for findOneAndUpdate operations
OrderSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    
    // If updating to completed status and completedAt isn't set
    if (update.status === 'completed' && !update.completedAt) {
        update.completedAt = new Date();
    }
    
    // If updating to out_for_delivery status and outForDeliveryAt isn't set
    if (update.status === 'out_for_delivery' && !update.outForDeliveryAt) {
        update.outForDeliveryAt = new Date();
    }
    
    next();
});

module.exports = mongoose.model('Order', OrderSchema);