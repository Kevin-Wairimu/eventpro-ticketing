import Ticket from '../models/Ticket.js';

// @desc    Get tickets for the logged-in user
// @route   GET /api/tickets/mytickets
// @access  Private
export const getMyTickets = async (req, res) => {
  try {
    // req.user is added by the 'protect' middleware
    // Find all tickets where the 'user' field matches the logged-in user's ID.
    // .populate('event') is the magic part: it automatically fetches the linked
    // event details (like name, date, imageUrl) and includes them in the response.
    const tickets = await Ticket.find({ user: req.user._id }).populate('event', 'name date imageUrl status');
    
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

