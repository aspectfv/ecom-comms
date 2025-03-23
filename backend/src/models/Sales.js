const mongoose = require('mongoose');

const SalesSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  itemCode: { type: String, required: true },
  itemName: { type: String, required: true },
  owner: { type: String, required: true },
  price: { type: Number, required: true },
  completedAt: { type: Date, required: true },
  total: { type: Number, required: true }
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

module.exports = mongoose.model('Sales', SalesSchema);