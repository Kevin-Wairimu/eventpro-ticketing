import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Draft', 'Published', 'Cancelled'], default: 'Draft' },
  capacity: { type: Number, required: true },
  ticketsSold: { type: Number, default: 0 },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const Event = mongoose.model('Event', eventSchema);
export default Event;