import Event from '../models/Event.js';

// Get all events (no change needed)
export const getEvents = async (req, res) => {
  // --- DEBUG LOG #1: Confirm the request was received ---
  console.log("[Backend] Received request for GET /api/events"); 
  
  try {
    // Find all events in the database and sort by creation date
    const events = await Event.find({}).sort({ createdAt: -1 });

    // --- CRITICAL: Check if events were found ---
    if (events) {
      // --- DEBUG LOG #2: Confirm data was found and is being sent ---
      console.log(`[Backend] Found ${events.length} events. Sending response.`);
      // If successful, send the list of events as a JSON response.
      res.status(200).json(events);
    } else {
      // This case is unlikely but good to have.
      console.log("[Backend] Query successful, but no events found in the database.");
      // Send an empty array with a success status
      res.status(200).json([]);
    }
  } catch (error) {
    // --- CRITICAL: This block ensures an error response is always sent ---
    // If anything goes wrong with the database query, this will execute.
    console.error("--- ERROR FETCHING EVENTS ---");
    console.error(error);
    res.status(500).json({ message: "Server Error: Could not fetch events." });
  }
};




// Create an event
export const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    const createdEvent = await event.save();
    // --- REAL-TIME EMIT ---
    req.io.emit('eventCreated', createdEvent);
    res.status(201).json(createdEvent);
  } catch (error) { res.status(400).json({ message: "Invalid event data" }); }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      // ... (update properties)
      const updatedEvent = await event.save();
      // --- REAL-TIME EMIT ---
      req.io.emit('eventUpdated', updatedEvent);
      res.json(updatedEvent);
    } // ...
  } catch (error) { /* ... */ }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      await event.deleteOne();
      // --- REAL-TIME EMIT ---
      req.io.emit('eventDeleted', req.params.id);
      res.json({ message: "Event removed" });
    } // ...
  } catch (error) { /* ... */ }
};