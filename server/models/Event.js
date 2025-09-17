import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Draft', 'Published', 'Cancelled'], default: 'Draft' },
  capacity: { type: Number, required: true },
  ticketsSold: { type: Number, default: 0 },
  price: { type: Number, required: true, default: 0 },
  // You might want to add other fields here later
  location: { type: String },
  category: { type: String },
  imageUrl: { type: String },
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

const Event = mongoose.model('Event', eventSchema);

export default Event;