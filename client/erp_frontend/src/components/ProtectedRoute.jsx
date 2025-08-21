import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // wait until user is restored

  if (!user) return <Navigate to="/" replace />; // not logged in

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // redirect based on role
    if (user.role === "Employee") return <Navigate to="/profile" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
