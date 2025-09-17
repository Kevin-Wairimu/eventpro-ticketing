import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:4000';

export const socket = io(URL, {
  autoConnect: false
});