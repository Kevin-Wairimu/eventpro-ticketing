import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eventoria_user')) || null; } 
    catch { return null; }
  });

  // --- NEW: State to hold the redirect path after login ---
  const [redirectPath, setRedirectPath] = useState(null);

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
    setRedirectPath(null); // Also clear the path on logout
  };

  // --- NEW: Add redirectPath and its setter to the context value ---
  const value = { currentUser, login, logout, redirectPath, setRedirectPath };

  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
};

export const useAuth = () => useContext(AuthContext);