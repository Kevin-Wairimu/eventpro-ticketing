import express from 'express';
import { getMyTickets, getAllTickets } from '../controllers/ticketController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // We need to protect this route

const router = express.Router();

// Get all tickets for admin/employee
router.route('/').get(protect, admin, getAllTickets);

// This single line creates the GET /api/tickets/mytickets endpoint.
// The 'protect' middleware ensures only a logged-in user can access it.
router.route('/mytickets').get(protect, getMyTickets);

export default router;