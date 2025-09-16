import { io } from 'socket.io-client';

// Get the backend URL from environment variables, falling back for local dev
const URL = process.env.REACT_APP_API_URL ? 
            process.env.REACT_APP_API_URL.replace('/api', '') : 
            'http://localhost:4000';

console.log("Socket connecting to:", URL);

export const socket = io(URL, {
  autoConnect: false // We will connect manually after the user logs in
});