import { useState, useEffect } from "react";
import api from "../../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Reports() {
  const [period, setPeriod] = useState("This Month");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // FETCH REAL DATA
  // ==========================================
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("reports/manager/");
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!data) return null;

  // ==========================================
  // SAFE DATA MAPPING
  // ==========================================

  const totalRevenueMB = data.total_revenue
    ? (data.total_revenue / 1024 / 1024).toFixed(2)
    : 0;

  const stats = {
    totalRevenue: totalRevenueMB + " MB",
    filesProcessed: data.files_processed || 0,
    activeProjects: data.active_projects || 0,
    performance: data.performance_score || 0,
  };

  const revenueData = (data.revenue_trend || []).map((item) => ({
    name: item.week,
    value: item.value,
  }));

  const projectStatusData = [
    { name: "Active", value: data.project_status?.active || 0 },
    { name: "Completed", value: data.project_status?.completed || 0 },
    { name: "Archived", value: data.project_status?.archived || 0 },
  ];

  const departmentData = (data.files_per_department || []).map((item) => ({
    name: item.owner__role,
    files: item.count,
  }));

  const COLORS = ["#0d6efd", "#198754", "#dc3545"];

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
        Reports & Analytics
      </h2>

      {/* PERIOD TOGGLE */}
      <div style={{ marginBottom: "30px" }}>
        {["This Month", "Last Month"].map((item) => (
          <button
            key={item}
            className={
              period === item
                ? "btn btn-primary me-2"
                : "btn btn-outline-primary me-2"
            }
            onClick={() => setPeriod(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* STATS CARDS */}
      <div className="row g-4" style={{ marginBottom: "30px" }}>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Total Storage Used</p>
            <h3>{stats.totalRevenue}</h3>
            <small style={{ color: "#198754", fontWeight: "600" }}>
              {stats.performance}% growth
            </small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Files Processed</p>
            <h3>{stats.filesProcessed}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Active Projects</p>
            <h3>{stats.activeProjects}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Performance Score</p>
            <h3>{stats.performance}%</h3>
          </div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="row g-4">
        {/* LINE CHART */}
        <div className="col-md-8">
          <div className="dashboard-card">
            <h5 style={{ marginBottom: "20px" }}>Weekly Upload Trend</h5>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0d6efd"
                  strokeWidth={3}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="col-md-4">
          <div className="dashboard-card text-center">
            <h5 style={{ marginBottom: "20px" }}>Project Status</h5>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  animationDuration={1200}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BAR CHART SECTION */}
      <div className="dashboard-card" style={{ marginTop: "30px" }}>
        <h5 style={{ marginBottom: "20px" }}>Files per Role</h5>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="files" fill="#0d6efd" animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Reports;
