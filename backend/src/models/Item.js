const mongoose = require('mongoose');
const { getCategoryPrefix, validCategories } = require('../utils/categoryUtils');

const ItemSchema = new mongoose.Schema({
  itemCode: { 
    type: String, 
    required: true, 
    unique: true,
    default: function() {
        return `TEMP${Date.now()}-${Math.floor(Math.random() * 1000000000)}`;
    }
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  owner: { type: String, required: true },
  type: { type: String, enum: ['preloved', 'brandnew'], required: true },
  category: { 
    type: String, 
    required: true,
    enum: validCategories,
    validate: {
      validator: function(v) {
        return validCategories.includes(v);
      },
      message: props => `${props.value} is not a valid category!`
    }
  },
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
    }
  }
});

// Pre-save middleware to generate the item code
ItemSchema.pre('save', async function(next) {
  try {
    // Only generate a new code if this is a new item or if category changed
    if (this.isNew || this.isModified('category')) {
      const prefix = getCategoryPrefix(this.category);
      
      // Find the highest number for this category prefix
      const highestItem = await this.constructor.findOne(
        { itemCode: new RegExp(`^${prefix}\\d+`) },
        { itemCode: 1 },
        { sort: { itemCode: -1 } }
      );
      
      let nextNumber = 1;
      
      if (highestItem && highestItem.itemCode) {
        // Extract the number part and increment
        const match = highestItem.itemCode.match(/\d+$/);
        if (match) {
          nextNumber = parseInt(match[0], 10) + 1;
        }
      }
      
      // Format the number to have leading zeros (e.g., 001, 010, 100)
      const suffix = nextNumber.toString().padStart(3, '0');
      this.itemCode = `${prefix}${suffix}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Item', ItemSchema);