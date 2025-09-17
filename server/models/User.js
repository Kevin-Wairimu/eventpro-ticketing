import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['client', 'employee', 'admin'], default: 'client' },
  // --- NEW: Add a status field for the approval workflow ---
  status: { type: String, enum: ['Pending', 'Approved', 'Denied'], default: 'Pending' },
}, {
  timestamps: true
});

// This function automatically hashes the password before a NEW user is saved.
// This part is working correctly and will remain.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

export default User;