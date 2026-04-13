import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

// @desc    Get all tickets for admin/employee
// @route   GET /api/tickets
// @access  Private (Admin/Employee)
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        { model: User, attributes: ['email'] },
        { model: Event, attributes: ['name', 'price', 'date'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get tickets for the logged-in user
// @route   GET /api/tickets/mytickets
// @access  Private
export const getMyTickets = async (req, res) => {
  try {
    // req.user is added by the 'protect' middleware
    // Use Sequelize to find all tickets for this userId
    const tickets = await Ticket.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Event, attributes: ['name', 'date', 'imageUrl', 'status'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
