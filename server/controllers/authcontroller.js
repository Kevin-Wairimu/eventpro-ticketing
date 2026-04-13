import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const registerUser = async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const newUserDetails = {
      email,
      password,
      role: role && (role === 'admin' || role === 'employee') ? role : 'client',
      status: role && (role === 'admin' || role === 'employee') ? 'Approved' : 'Pending',
    };

    const user = await User.create(newUserDetails);
    
    if (user) {
      if (user.status === 'Pending') {
        const userForEmit = { 
          id: user.id, 
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
        
      res.status(201).json({ message: successMessage, userId: user.id });
    } else {
      res.status(400).json({ message: 'Invalid user data provided.' });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password: enteredPassword } = req.body;
  try {
    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isMatch = await bcrypt.compare(enteredPassword, user.password);

    if (isMatch) {
      if (user.status !== 'Approved') {
        return res.status(403).json({ message: `Your account status is: ${user.status}. Access denied.` });
      }

      res.json({
        user: { id: user.id, email: user.email, role: user.role },
        accessToken: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server Error during login' });
  }
};
