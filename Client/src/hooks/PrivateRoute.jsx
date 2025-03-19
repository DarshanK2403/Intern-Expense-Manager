import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const [auth, setAuth] = useState(null); // User is authenticated or not
  const [isAdmin, setIsAdmin] = useState(false); // Is the user an admin

  useEffect(() => {
    const id = localStorage.getItem("id");

    const getRole = async () => {
      try {
        if (id) {
          const res = await axios.get(`/userdata/${id}`);
          const role = res.data.role.name;

          if (role === "user") {
            setAuth(true);
            setIsAdmin(false); // User role should not access admin routes
          } else if (role === "admin") {
            setAuth(true);
            setIsAdmin(true); // Admin role should access admin routes
          } else {
            setAuth(false); // If role is invalid, block access
          }
        } else {
          setAuth(false); // No ID means no user is logged in
        }
      } catch (error) {
        console.log(error);
        setAuth(false);
      }
    };

    getRole();
  }, []);

  return { auth, isAdmin };
};

// ✅ Private route for general authentication (non-admin)
const PrivateRoute = () => {
  const { auth } = useAuth();

  if (auth === null) {
    return <div>Loading...</div>;
  }

  return auth ? <Outlet /> : <Navigate to="/signin" replace />;
};

// ✅ Private route for Admin Only
const AdminRoute = () => {
  const { auth, isAdmin } = useAuth();

  if (auth === null) {
    return <div>Loading...</div>;
  }

  return auth && isAdmin ? <Outlet /> : <Navigate to="/signin" replace />;
};

export { PrivateRoute, AdminRoute };
