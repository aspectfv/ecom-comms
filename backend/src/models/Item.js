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
  status: {
    type: String,
    enum: ['available', 'ordered', 'sold'],
    default: 'available'
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

// Post-save middleware to delete item when marked as sold
ItemSchema.post('save', async function(doc, next) {
  try {
    // Only proceed if the status is 'sold'
    if (doc.status === 'sold') {
      await mongoose.model('Item').deleteOne({ _id: doc._id });
      console.log(`Item ${doc.itemCode} has been deleted after being marked as sold.`);
    }
    next();
  } catch (error) {
    console.error(`Error in post-save hook for item ${doc.itemCode}:`, error);
    next(error);
  }
});

// Also handle status changes in findOneAndUpdate operations
ItemSchema.pre('findOneAndUpdate', async function(next) {
  try {
    const update = this.getUpdate();
    
    // Check if status is being updated to 'sold'
    if (update && update.status === 'sold') {
      // Get the document ID that's being updated
      const docId = this.getQuery()._id;
      
      // Mark for deletion after the update completes
      this._deleteAfterUpdate = docId;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Post-update middleware to delete item when marked as sold via update
ItemSchema.post('findOneAndUpdate', async function(result) {
  try {
    // Check if we marked this document for deletion
    if (this._deleteAfterUpdate) {
      const docId = this._deleteAfterUpdate;
      
      // If the update was successful and the item is now marked as sold
      if (result && result.status === 'sold') {
        await mongoose.model('Item').deleteOne({ _id: docId });
        console.log(`Item ${result.itemCode} has been deleted after being marked as sold.`);
      }
    }
  } catch (error) {
    console.error('Error in post-findOneAndUpdate hook:', error);
  }
});

module.exports = mongoose.model('Item', ItemSchema);