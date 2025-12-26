import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    role: {
      type: String,
      enum: ['patient', 'nurse', 'admin'],
      required: [true, 'Role is required']
    },
    wardOrRoom: {
      type: String,
      required: [true, 'Ward or room is required'],
      trim: true
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries by role and ward
userSchema.index({ role: 1, wardOrRoom: 1 });

const User = mongoose.model('User', userSchema);

export default User;