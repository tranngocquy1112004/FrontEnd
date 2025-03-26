import React, { createContext, useState, useEffect } from "react";

// Tạo AuthContext với giá trị mặc định
export const AuthContext = createContext({
  isLoggedIn: false,
  currentUser: null,
  login: () => {},
  logout: () => {},
});

// Constants cho localStorage keys
const LOCAL_STORAGE_KEYS = {
  CURRENT_USER: "currentUser",
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER));
    if (savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(savedUser);
    }
  }, []);

  const login = (user) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const contextValue = {
    isLoggedIn,
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};