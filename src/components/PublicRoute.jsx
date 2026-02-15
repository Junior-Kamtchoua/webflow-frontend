import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (user) {
    if (user.role === "ADMIN") {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (user.role === "MANAGER") {
      return <Navigate to="/dashboard/manager" replace />;
    } else {
      return <Navigate to="/dashboard/user" replace />;
    }
  }

  return children;
}

export default PublicRoute;
