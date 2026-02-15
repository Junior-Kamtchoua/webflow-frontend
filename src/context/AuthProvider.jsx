import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔁 Redirection selon rôle (aligné avec tes routes)
  const redirectByRole = useCallback(
    (role) => {
      if (role === "ADMIN") {
        navigate("/dashboard/admin", { replace: true });
      } else if (role === "MANAGER") {
        navigate("/dashboard/manager", { replace: true });
      } else {
        navigate("/dashboard/user", { replace: true });
      }
    },
    [navigate],
  );

  // 🔎 Vérifier si utilisateur déjà connecté (au refresh)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("access");

        if (!token) {
          setLoading(false);
          return;
        }

        // Ajouter token au header
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const res = await api.get("me/");
        setUser(res.data);
      } catch {
        localStorage.removeItem("access");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔐 Login
  const login = async (username, password) => {
    const response = await api.post("token/", { username, password });

    const accessToken = response.data.access;

    // Sauvegarde token
    localStorage.setItem("access", accessToken);

    // Ajoute header Authorization
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    // Récupère user
    const res = await api.get("me/");
    setUser(res.data);
    console.log("USER CONNECTED:", res.data);

    redirectByRole(res.data.role);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("access");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
