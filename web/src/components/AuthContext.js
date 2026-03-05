import React, { createContext, useContext, useState, useEffect } from "react";
import { socket } from '../socket'; // Assuming you have a shared socket instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('eventoria_user')) || null);
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    // Simulate an initial auth check or just set loading to false since we use localStorage synchronously
    setLoading(false);

    if (currentUser) {
      socket.connect();
      socket.emit('joinRoom', currentUser.role);
    }
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [currentUser]);

  const login = (userData) => {
    if (userData) {
      localStorage.setItem('eventoria_user', JSON.stringify(userData));
      setCurrentUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('eventoria_user');
    localStorage.removeItem('accessToken');
    setCurrentUser(null);
    setRedirectPath(null); 
  };
  
  const value = { 
    currentUser, 
    login, 
    logout, 
    redirectPath, 
    setRedirectPath,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};