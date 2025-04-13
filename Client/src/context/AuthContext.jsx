/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Step 1: Create the context for global user state
export const AuthContext = createContext();

// Step 2: Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user info
  const [loading, setLoading] = useState(true); // Track loading state

  // Step 3: Fetch user data from API on initial load if the token exists
  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token) {
      // Make a request to get user data
      axios.get("/userdata", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUser(res.data); 
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
        setUser(null);  // If there's an error, reset user
      })
      .finally(() => {
        setLoading(false); // Stop loading once the request completes
      });
    } else {
      setLoading(false); // If no token, stop loading
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
