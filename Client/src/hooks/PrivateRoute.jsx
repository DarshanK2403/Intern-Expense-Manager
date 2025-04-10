import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const [auth, setAuth] = useState(null); // User is authenticated or not
  const [isAdmin, setIsAdmin] = useState(false); // Is the user an admin

  useEffect(() => {
    const getRole = async () => {
      const token = localStorage.getItem("Token");
      try {
        const res = await axios.get("/userdata", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token in header
          },
        }); // Token is sent via header
        const role = res.data.role.name;

        if (role === "user") {
          setAuth(true);
          setIsAdmin(false);
        } else if (role === "admin") {
          setAuth(true);
          setIsAdmin(true);
        } else {
          setAuth(false);
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
