import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useContext(AuthContext);

  // ⏳ Pendant vérification auth
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div>Loading...</div>
      </div>
    );
  }

  // ❌ Pas connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Rôle non autorisé
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard/user" replace />;
  }

  return children;
}

export default ProtectedRoute;
