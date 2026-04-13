import Event from '../models/Event.js';

// Get all events
export const getEvents = async (req, res) => {
  // --- DEBUG LOG #1: Confirm the request was received ---
  console.log("[Backend] Received request for GET /api/events"); 
  
  try {
    // Find all events in the database and sort by creation date using Sequelize
    const events = await Event.findAll({
      order: [['createdAt', 'DESC']]
    });

    // --- CRITICAL: Check if events were found ---
    if (events && events.length > 0) {
      // --- DEBUG LOG #2: Confirm data was found and is being sent ---
      console.log(`[Backend] Found ${events.length} events. Sending response.`);
      // If successful, send the list of events as a JSON response.
      res.status(200).json(events);
    } else {
      console.log("[Backend] Query successful, but no events found in the database.");
      // Send an empty array with a success status
      res.status(200).json([]);
    }
  } catch (error) {
    // --- CRITICAL: This block ensures an error response is always sent ---
    console.error("--- ERROR FETCHING EVENTS ---");
    console.error(error);
    res.status(500).json({ message: "Server Error: Could not fetch events." });
  }
};

// Create an event
export const createEvent = async (req, res) => {
  try {
    // Sequelize: use create() to build and save in one step
    const createdEvent = await Event.create(req.body);
    // --- REAL-TIME EMIT ---
    req.io.emit('eventCreated', createdEvent);
    res.status(201).json(createdEvent);
  } catch (error) { 
    console.error("Create Event Error:", error);
    res.status(400).json({ message: "Invalid event data" }); 
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (event) {
      // Update properties from req.body
      await event.update(req.body);
      // --- REAL-TIME EMIT ---
      req.io.emit('eventUpdated', event);
      res.json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) { 
    console.error("Update Event Error:", error);
    res.status(400).json({ message: "Error updating event" }); 
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (event) {
      await event.destroy();
      // --- REAL-TIME EMIT ---
      req.io.emit('eventDeleted', req.params.id);
      res.json({ message: "Event removed" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) { 
    console.error("Delete Event Error:", error);
    res.status(500).json({ message: "Error deleting event" }); 
  }
};
