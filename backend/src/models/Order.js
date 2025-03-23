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
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
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

module.exports = mongoose.model('Order', OrderSchema);