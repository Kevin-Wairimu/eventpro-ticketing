import User from '../models/User.js';

// @desc    Get all users (for Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  console.log("[Backend] Received request for GET /api/users"); // Debug log
  try {
    // Find all users and exclude their password field.
    // Sort by creation date so newest users are first.
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    // --- CRITICAL: Check if users were found ---
    if (users) {
      console.log(`[Backend] Found ${users.length} users. Sending response.`);
      // If successful, send the list of users as a JSON response.
      res.status(200).json(users);
    } else {
      // This case is unlikely but good to have.
      console.log("[Backend] No users found in the database.");
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    // --- CRITICAL: This block ensures an error response is always sent ---
    // If anything goes wrong with the database query, this will execute.
    console.error("--- ERROR FETCHING USERS ---");
    console.error(error);
    res.status(500).json({ message: "Server Error: Could not fetch users." });
  }
};


// @desc    Update user status (approve/deny)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
  // ... (This function is likely fine, but keep it robust)
  const { status } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.status = status;
      const updatedUser = await user.save();
      
      const userForEmit = { _id: updatedUser._id, email: updatedUser.email, role: updatedUser.role, createdAt: updatedUser.createdAt, status: updatedUser.status };
      req.io.to('admin').to('employee').emit('userStatusUpdated', userForEmit);
      
      res.json(userForEmit);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};