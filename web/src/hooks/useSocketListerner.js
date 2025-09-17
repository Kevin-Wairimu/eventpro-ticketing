import { useEffect } from 'react';
import { socket } from '../socket'; // Your shared socket instance

/**
 * A custom React hook that robustly sets up and cleans up a Socket.IO event listener.
 * It ensures the listener is only active when the socket is connected.
 * @param {string} eventName - The name of the event to listen for.
 * @param {Function} callback - The function to execute when the event is received.
 */
const useSocketListener = (eventName, callback) => {
  useEffect(() => {
    // Wrapper function to ensure callback only runs if socket is connected
    const handleEvent = (data) => {
      if (socket.connected) {
        callback(data);
      }
    };

    // Confirm that we are attaching the listener
    console.log(`[useSocketListener] Setting up listener for event: "${eventName}"`);
    socket.on(eventName, handleEvent);

    // This cleanup function is crucial to prevent duplicate listeners
    // when the component re-renders or unmounts.
    return () => {
      console.log(`[useSocketListener] Cleaning up listener for event: "${eventName}"`);
      socket.off(eventName, handleEvent);
    };
  }, [eventName, callback]); // Re-run the effect if the event name or callback changes
};

export default useSocketListener;