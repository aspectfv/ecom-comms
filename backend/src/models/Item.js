const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  itemCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  owner: { type: String, required: true },
  type: { type: String, enum: ['preloved', 'brandnew'], required: true },
  category: { type: String, required: true },
  description: { type: String },
  condition: { type: String },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
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
module.exports = mongoose.model('Item', ItemSchema);