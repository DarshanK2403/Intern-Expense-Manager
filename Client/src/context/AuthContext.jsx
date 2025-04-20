/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  // Function to fetch user data
  const fetchUserData = (token) => {
    axios
      .get("/userdata", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        // console.log(res.data); 
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("Token", token);
    fetchUserData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("Token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
