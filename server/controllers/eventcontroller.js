import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public (or Protected, depending on your needs)
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: -1 }); // Get newest first
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res) => {
  const { name, date, capacity, status } = req.body;
  try {
    const event = new Event({ name, date, capacity, status });
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(400).json({ message: "Invalid event data" });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res) => {
  const { name, date, capacity, status } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      event.name = name || event.name;
      event.date = date || event.date;
      event.capacity = capacity || event.capacity;
      event.status = status || event.status;
      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid event data" });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      await event.deleteOne(); // Use deleteOne() instead of remove()
      res.json({ message: "Event removed" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};