import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // --- CRITICAL: Import bcryptjs here ---

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const registerUser = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ email, password, role });
    if (user) {
      res.status(201).json({ _id: user._id, email: user.email, role: user.role });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password: enteredPassword } = req.body;
  try {
    // Step 1: Find the user and explicitly select their password.
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // User not found
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // --- CRITICAL FIX: Perform the comparison directly here ---
    // Compare the plain text password from the request with the user's hashed password.
    const isMatch = await bcrypt.compare(enteredPassword, user.password);

    if (isMatch) {
      // Passwords match. Send back the user data and token.
      res.json({
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
        },
        accessToken: generateToken(user._id),
      });
    } else {
      // Passwords do not match.
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during login' });
  }
};