import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Topbar({ role }) {
  const { logout, user } = useContext(AuthContext);

  return (
    <div
      style={{
        height: "70px",
        background: "white",
        borderRadius: "15px",
        marginBottom: "20px",
        padding: "0 25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* LEFT SIDE */}
      <div>
        <h5 style={{ margin: 0 }}>{role} Dashboard</h5>
        {user && (
          <small style={{ color: "#6c757d" }}>
            Logged in as: {user.username}
          </small>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span>🔔</span>
        <span>👤</span>

        <button onClick={logout} className="btn btn-outline-danger btn-sm">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Topbar;
