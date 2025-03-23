const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  contactNumber: { type: String },
  address: {
    street: String,
    city: String
  },
  role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
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

// Hash password before saving to database
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if the password is modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hash password before updating
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);