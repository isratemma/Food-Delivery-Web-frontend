import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'owner', 'deliveryBoy'],
      required: true,
    },
    googleUid: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: '',
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
