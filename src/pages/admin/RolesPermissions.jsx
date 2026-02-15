import { useEffect, useState } from "react";
import api from "../../services/api";

// 🔄 Ordre fixe des rôles (constante stable)
const ROLE_ORDER = ["ADMIN", "MANAGER", "USER"];

// 🔐 Permissions FIXES alignées avec ton backend
const PERMISSIONS_MAP = {
  ADMIN: {
    dashboard: true,
    users: true,
    projects: true,
    reports: true,
    storage: true,
    logs: true,
  },
  MANAGER: {
    dashboard: true,
    users: false,
    projects: true,
    reports: true,
    storage: false,
    logs: true,
  },
  USER: {
    dashboard: true,
    users: false,
    projects: false,
    reports: false,
    storage: false,
    logs: false,
  },
};

const MODULES = [
  { key: "dashboard", label: "Dashboard Access" },
  { key: "users", label: "Users Management" },
  { key: "projects", label: "Projects Access" },
  { key: "reports", label: "Reports Access" },
  { key: "storage", label: "Storage Control" },
  { key: "logs", label: "System Logs" },
];

function RolesPermissions() {
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("admin/roles-distribution/");

        // Transformer réponse en map
        const roleMap = {};
        res.data.forEach((item) => {
          roleMap[item.name.toUpperCase()] = item.value;
        });

        // Construire liste complète dans l’ordre voulu
        const formattedRoles = ROLE_ORDER.map((roleKey) => ({
          name: roleKey,
          count: roleMap[roleKey] || 0,
        }));

        setRolesData(formattedRoles);
      } catch (error) {
        console.error("Error loading roles distribution:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
        Roles & Permissions
      </h2>

      <div className="dashboard-card">
        <h5 style={{ marginBottom: "20px" }}>Permissions Matrix</h5>

        <div style={{ overflowX: "auto" }}>
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Role</th>
                {MODULES.map((module) => (
                  <th key={module.key}>{module.label}</th>
                ))}
                <th>Total Users</th>
              </tr>
            </thead>

            <tbody>
              {rolesData.map((role) => {
                const permissions = PERMISSIONS_MAP[role.name];

                return (
                  <tr key={role.name}>
                    <td>
                      <strong>
                        {role.name.charAt(0) + role.name.slice(1).toLowerCase()}
                      </strong>
                      <span className="badge bg-secondary ms-2">System</span>
                    </td>

                    {MODULES.map((module) => (
                      <td key={module.key}>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={permissions[module.key]}
                            disabled
                            style={{
                              transform: "scale(1.2)",
                            }}
                          />
                        </div>
                      </td>
                    ))}

                    <td>
                      <span className="badge bg-primary">{role.count}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RolesPermissions;
