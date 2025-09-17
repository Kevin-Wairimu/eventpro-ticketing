import React, { createContext, useContext, useState, useEffect } from "react";
import { socket } from '../socket'; // Assuming you have a shared socket instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('eventoria_user')) || null);
  
  // --- THIS IS THE CRITICAL FIX ---
  // We must define the state variable 'redirectPath' and its setter function
  // before we can use them anywhere else in this component.
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
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
    // This part is also crucial and now works because setRedirectPath is defined
    setRedirectPath(null); 
  };
  
  // This value object will now work because 'redirectPath' and 'setRedirectPath' are defined above.
  const value = { 
    currentUser, 
    login, 
    logout, 
    redirectPath, 
    setRedirectPath 
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