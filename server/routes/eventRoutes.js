import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get all events
router.route('/').get(getEvents);

// Admin-only routes for creating, updating, and deleting events
router.route('/').post(protect, admin, createEvent);
router.route('/:id').put(protect, admin, updateEvent);
router.route('/:id').delete(protect, admin, deleteEvent);

export default router;