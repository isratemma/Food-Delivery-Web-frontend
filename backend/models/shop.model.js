import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['restaurant', 'cafe', 'bakery', 'grocery', 'pharmacy', 'other'],
      default: 'restaurant',
    },
    cuisine: {
      type: String,
      default: '',
    },
    address: {
      street:  { type: String, default: '' },
      city:    { type: String, default: '' },
      country: { type: String, default: '' },
    },
    phone: {
      type: String,
      default: '',
    },
    openingHours: {
      open:  { type: String, default: '09:00' },
      close: { type: String, default: '22:00' },
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    minOrder: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;
