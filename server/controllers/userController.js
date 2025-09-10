import User from '../models/User.js';

// @desc    Get all users (for Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    // Find all users in the database and exclude their password field for security
    const users = await User.find({}).select('-password');
    
    // Send the list of users as a JSON response
    res.json(users);
  } catch (error) {
    // If something goes wrong with the database query, send a server error
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error" });
  }
};