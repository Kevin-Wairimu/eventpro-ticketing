import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eventoria_user')) || null; } 
    catch { return null; }
  });

  // This is now a simple "setter" function. Its only job is to update the state.
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
  };

  const value = { currentUser, login, logout };

  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
};

export const useAuth = () => useContext(AuthContext);   