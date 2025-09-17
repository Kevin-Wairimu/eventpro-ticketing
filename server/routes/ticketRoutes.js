import express from 'express';
import { getMyTickets } from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js'; // We need to protect this route

const router = express.Router();

// This single line creates the GET /api/tickets/mytickets endpoint.
// The 'protect' middleware ensures only a logged-in user can access it.
router.route('/mytickets').get(protect, getMyTickets);

export default router;