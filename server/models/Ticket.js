import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event' // This creates a link to your Event model
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // This creates a link to your User model
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Completed'],
    default: 'Pending'
  },
  // You can add more details here later, like price paid, seat number, etc.
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// This line is crucial for the import to work correctly
export default Ticket;