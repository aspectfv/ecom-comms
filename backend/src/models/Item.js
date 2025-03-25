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
            // Transform ID field
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            
            // Transform image URLs to include host
            if (ret.images && ret.images.length > 0) {
                const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
                ret.images = ret.images.map(img => {
                    // Only prepend baseUrl if the image path doesn't already include http:// or https://
                    if (img && !img.startsWith('http://') && !img.startsWith('https://')) {
                        // Make sure we don't duplicate slashes
                        const imgPath = img.startsWith('/') ? img : `/${img}`;
                        return `${baseUrl}${imgPath}`;
                    }
                    return img;
                });
            }
            
            return ret;
        },
    },
});

module.exports = mongoose.model('Item', ItemSchema);