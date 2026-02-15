import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ManagerHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("dashboard/manager/");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching manager dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Error loading dashboard</div>;

  const {
    total_members,
    total_projects,
    total_files,
    total_storage_used,
    weekly_uploads,
    growth_percentage,
    top_projects,
    recent_activity,
  } = data;

  const storageGB = (total_storage_used / (1024 * 1024 * 1024)).toFixed(2);

  // 🔥 Fonction pour afficher "2h ago"
  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;

    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
        Manager Dashboard
      </h2>

      {/* STATS CARDS */}
      <div className="row g-4" style={{ marginBottom: "30px" }}>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Team Members</p>
            <h3>{total_members}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Active Projects</p>
            <h3>{total_projects}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Total Files</p>
            <h3>{total_files}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Storage Used</p>
            <h3>{storageGB} GB</h3>
            <small
              style={{
                color: growth_percentage >= 0 ? "#198754" : "#dc3545",
                fontWeight: "600",
              }}
            >
              {growth_percentage >= 0 ? "+" : ""}
              {growth_percentage}% this week
            </small>
          </div>
        </div>
      </div>

      {/* CHART + TOP PROJECTS */}
      <div className="row g-4" style={{ marginBottom: "30px" }}>
        <div className="col-md-8">
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <h5 style={{ marginBottom: "20px", fontWeight: "600" }}>
              Team Weekly Uploads
            </h5>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weekly_uploads}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="uploads"
                  stroke="#0d6efd"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP PROJECTS */}
        <div className="col-md-4">
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            <h5 style={{ marginBottom: "20px", fontWeight: "600" }}>
              Top Active Projects
            </h5>

            {top_projects.length === 0 && (
              <p style={{ color: "#6c757d" }}>No projects yet</p>
            )}

            {top_projects.map((project) => (
              <div key={project.id} style={{ marginBottom: "15px" }}>
                <strong>{project.name}</strong>
                <div style={{ fontSize: "14px", color: "#6c757d" }}>
                  {project.file_count} files
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        <h5 style={{ marginBottom: "20px", fontWeight: "600" }}>
          Recent Team Activity
        </h5>

        {recent_activity.length === 0 && (
          <p style={{ color: "#6c757d" }}>No activity yet</p>
        )}

        {recent_activity.map((activity, index) => (
          <div
            key={index}
            style={{
              padding: "12px 0",
              borderBottom:
                index !== recent_activity.length - 1
                  ? "1px solid #f1f1f1"
                  : "none",
            }}
          >
            <strong>{activity.user}</strong> uploaded {activity.file}
            <div style={{ fontSize: "13px", color: "#6c757d" }}>
              {timeAgo(activity.uploaded_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagerHome;
