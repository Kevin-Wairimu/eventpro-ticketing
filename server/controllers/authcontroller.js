import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const registerUser = async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // --- CRITICAL FIX: Stricter and clearer approval logic ---
    const newUserDetails = {
      email,
      password,
      // If a role is provided AND it's either 'admin' or 'employee', use it.
      // Otherwise, ALWAYS default to 'client'.
      role: role && (role === 'admin' || role === 'employee') ? role : 'client',
      
      // If a role is provided AND it's a privileged role, auto-approve them.
      // ALL OTHER users (i.e., public client registrations) are ALWAYS 'Pending'.
      status: role && (role === 'admin' || role === 'employee') ? 'Approved' : 'Pending',
    };

    const user = await User.create(newUserDetails);
    
    if (user) {
      // If the new user has a 'Pending' status, emit the real-time event.
      if (user.status === 'Pending') {
        const userForEmit = { 
          _id: user._id, 
          email: user.email, 
          role: user.role, 
          createdAt: user.createdAt, 
          status: user.status 
        };
        req.io.to('admin').to('employee').emit('newUserPending', userForEmit);
      }
      
      const successMessage = user.status === 'Pending' 
        ? "Registration successful! Your account is pending approval."
        : "User created successfully.";
        
      res.status(201).json({ message: successMessage, userId: user._id });
    } else {
      res.status(400).json({ message: 'Invalid user data provided.' });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- Login function now checks for 'Approved' status ---
export const loginUser = async (req, res) => {
  const { email, password: enteredPassword } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isMatch = await bcrypt.compare(enteredPassword, user.password);

    if (isMatch) {
      // --- CRITICAL SECURITY CHECK ---
      // Do not allow users who are not 'Approved' to log in.
      if (user.status !== 'Approved') {
        return res.status(403).json({ message: `Your account status is: ${user.status}. Access denied.` });
      }

      // If approved, send back the user data and token.
      res.json({
        user: { _id: user._id, email: user.email, role: user.role },
        accessToken: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server Error during login' });
  }
};