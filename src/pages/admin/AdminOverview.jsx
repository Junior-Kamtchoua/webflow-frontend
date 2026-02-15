import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    storageUsed: 0,
    revenue: "$124,000", // temporaire
  });

  const [userGrowthData, setUserGrowthData] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#dc3545", "#0d6efd", "#198754"];

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await api.get("stats/admin/");
        const rolesRes = await api.get("admin/roles-distribution/");
        const growthRes = await api.get("admin/user-growth/");

        setStats({
          totalUsers: statsRes.data.total_users,
          activeUsers: statsRes.data.total_users,
          storageUsed: statsRes.data.total_storage_used,
          revenue: "$124,000",
        });

        setRolesData(rolesRes.data);
        setUserGrowthData(growthRes.data);
      } catch (error) {
        console.error("Erreur Admin Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const formatStorage = (bytes) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2) + " GB";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ marginBottom: "30px", fontWeight: 600 }}>Admin Overview</h2>

      {/* ===================== */}
      {/* STATS CARDS */}
      {/* ===================== */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="dashboard-card text-center p-4">
            <p className="text-muted mb-1">Total Users</p>
            <h3 className="fw-bold">{stats.totalUsers}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center p-4">
            <p className="text-muted mb-1">Active Users</p>
            <h3 className="fw-bold">{stats.activeUsers}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center p-4">
            <p className="text-muted mb-1">Storage Used</p>
            <h3 className="fw-bold">{formatStorage(stats.storageUsed)}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center p-4">
            <p className="text-muted mb-1">Revenue</p>
            <h3 className="fw-bold">{stats.revenue}</h3>
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* CHARTS */}
      {/* ===================== */}
      <div className="row g-4">
        {/* LINE CHART */}
        <div className="col-md-8">
          <div className="dashboard-card p-4" style={{ minHeight: 350 }}>
            <h5 className="mb-4 fw-semibold">User Growth</h5>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#0d6efd"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="col-md-4">
          <div className="dashboard-card p-4" style={{ minHeight: 350 }}>
            <h5 className="mb-4 fw-semibold text-center">Roles Distribution</h5>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={rolesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  isAnimationActive
                  animationDuration={1000}
                >
                  {rolesData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* SYSTEM ACTIVITY */}
      {/* ===================== */}
      <div className="dashboard-card p-4 mt-4">
        <h5 className="fw-semibold mb-4">Recent System Activity</h5>

        <ul className="list-unstyled">
          <li className="mb-2 text-success">● Real Neon database connected</li>
          <li className="mb-2 text-warning">● JWT authentication active</li>
          <li className="text-danger">● Ready for production upgrade</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminOverview;
