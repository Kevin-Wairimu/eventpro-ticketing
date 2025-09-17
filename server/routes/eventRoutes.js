import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- CRITICAL: Is this route public or private? ---
// If ANYONE should be able to see the events (like on the LandingPage), this is correct.
router.route('/').get(getEvents); 

// If ONLY logged-in admins should see the events, it should be this:
// router.route('/').get(protect, admin, getEvents);

// Admin-only routes for CUD operations
router.route('/').post(protect, admin, createEvent);
router.route('/:id').put(protect, admin, updateEvent);
router.route('/:id').delete(protect, admin, deleteEvent);

export default router;