import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // wait until user is restored

  if (user) {
    // logged in users should not access login page
    if (user.role === "Admin" || user.role === "Manager") return <Navigate to="/dashboard" replace />;
    if (user.role === "Employee") return <Navigate to="/profile" replace />;
  }

  return children;
};

export default PublicRoute;
