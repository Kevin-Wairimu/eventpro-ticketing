import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper function to generate a JWT (no changes needed here)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// --- UPDATED registerUser function ---
export const registerUser = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ email, password, role });
    
    if (user) {
      // --- THIS IS THE NEW REAL-TIME LOGIC ---
      // After successfully creating a user in the database, we use the 'io'
      // instance (attached to the request object by our middleware in server.js)
      // to broadcast a message.
      // We emit to both the 'admin' and 'employee' rooms, so anyone logged into
      // those dashboards will receive the notification instantly.
      
      const userForEmit = { _id: user._id, email: user.email, role: user.role, createdAt: user.createdAt };
      req.io.to('admin').to('employee').emit('newUserRegistered', userForEmit);
      
      // We still send the standard HTTP response back to the original requester.
      res.status(201).json({ _id: user._id, email: user.email, role: user.role });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// --- The loginUser function is already perfect and needs NO changes ---
export const loginUser = async (req, res) => {
  const { email, password: enteredPassword } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(enteredPassword, user.password);

    if (isMatch) {
      res.json({
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
        },
        accessToken: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server Error during login' });
  }
};