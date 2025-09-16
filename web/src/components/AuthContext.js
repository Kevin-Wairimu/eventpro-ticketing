import React, { createContext, useContext, useState, useEffect } from "react";
// --- 1. Import the shared socket instance ---
import { socket } from '../socket'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('eventoria_user')) || null);
  const [redirectPath, setRedirectPath] = useState(null);

  // --- 2. NEW: Connect/disconnect socket based on login state ---
  useEffect(() => {
    if (currentUser) {
      // If a user logs in, connect the socket
      socket.connect();
      // Join a "room" based on the user's role, so the backend can send targeted messages
      socket.emit('joinRoom', currentUser.role);
    }

    // This cleanup function runs when the user logs out or the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [currentUser]); // This effect re-runs whenever the currentUser changes

  const login = (userData) => {
    if (userData) {
      localStorage.setItem('eventoria_user', JSON.stringify(userData));
      setCurrentUser(userData); // This will trigger the useEffect above to connect the socket
    }
  };

  const logout = () => {
    localStorage.removeItem('eventoria_user');
    localStorage.removeItem('accessToken');
    setCurrentUser(null); // This will trigger the cleanup in the useEffect to disconnect
    setRedirectPath(null);
  };

  const value = { currentUser, login, logout, redirectPath, setRedirectPath };

  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
};

export const useAuth = () => useContext(AuthContext);