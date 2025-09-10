import express from 'express';
// --- This import will now work because the file exists ---
import { getUsers } from '../controllers/userController.js'; 
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// This line creates the GET /api/users endpoint.
// It is protected by two middlewares:
// 1. 'protect': Ensures a user is logged in.
// 2. 'admin': Ensures the logged-in user has the 'admin' role.
router.route('/').get(protect, admin, getUsers);

export default router;