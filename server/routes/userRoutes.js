import express from 'express';

// --- THIS IS THE CRITICAL FIX ---
// We only need ONE import statement for the userController.
// This single line correctly imports both functions we need.
import { getUsers, updateUserStatus } from '../controllers/userController.js'; 

// We also only need ONE import for the authMiddleware.
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get all users, protected for admins.
router.route('/').get(protect, admin, getUsers);

// Route to update a user's status, also protected for admins.
router.route('/:id/status').put(protect, admin, updateUserStatus);

// This is the correct way to export the configured router.
export default router;