import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";

function Activity() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activities, setActivities] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({
    total: 0,
    uploads: 0,
    downloads: 0,
    shares: 0,
  });

  const [weeklyData, setWeeklyData] = useState([]);
  const itemsPerPage = 5;

  // 🔥 FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("activity/");
        setActivities(res.data);

        const weeklyRes = await api.get("activity/weekly/");

        setWeeklyStats({
          total: weeklyRes.data.total,
          uploads: weeklyRes.data.uploads,
          downloads: weeklyRes.data.downloads,
          shares: weeklyRes.data.shares,
          previous: weeklyRes.data.previous_total,
        });

        setWeeklyData(weeklyRes.data.weekly_data);
      } catch (error) {
        console.error("Activity error:", error);
      }
    };

    fetchData();
  }, []);

  const thisWeekTotal = weeklyStats.total;
  const lastWeekTotal = weeklyStats.previous || 0;

  const percentageChange =
    lastWeekTotal === 0
      ? thisWeekTotal > 0
        ? 100
        : 0
      : Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);

  // 📊 Stats
  const totalActivities = weeklyStats.total;
  const totalUploads = weeklyStats.uploads;
  const totalDownloads = weeklyStats.downloads;
  const totalShares = weeklyStats.shares;

  // 🔍 Filter + Search
  const filteredActivities = activities.filter((activity) => {
    const matchesFilter =
      filter === "All" || activity.action === filter.toUpperCase();

    const matchesSearch =
      activity.file_name &&
      activity.file_name.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivities = filteredActivities.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // 📅 Group by date
  const groupedActivities = currentActivities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp).toDateString();

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(activity);
    return groups;
  }, {});

  return (
    <div>
      {/* TITLE */}
      <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
        Activity Timeline
      </h2>

      {/* MINI CHART */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h5 style={{ margin: 0, fontWeight: "600" }}>Weekly Activity</h5>

          <div>
            <span
              style={{
                color: percentageChange >= 0 ? "#198754" : "#dc3545",
                fontWeight: "600",
              }}
            >
              {percentageChange >= 0 ? "+" : ""}
              {percentageChange}% this week
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={weeklyData}>
            <XAxis dataKey="day" />
            <YAxis hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0d6efd"
              strokeWidth={3}
              dot={false}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* STATS CARDS */}
      <div className="row g-4" style={{ marginBottom: "30px" }}>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <div style={{ fontSize: "22px" }}>📊</div>
            <p>Total</p>
            <h3>{totalActivities}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <div style={{ fontSize: "22px" }}>📤</div>
            <p>Uploads</p>
            <h3>{totalUploads}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <div style={{ fontSize: "22px" }}>📥</div>
            <p>Downloads</p>
            <h3>{totalDownloads}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <div style={{ fontSize: "22px" }}>🔗</div>
            <p>Shares</p>
            <h3>{totalShares}</h3>
          </div>
        </div>
      </div>

      {/* FILTER + SEARCH */}
      <div
        style={{
          marginBottom: "25px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          {["All", "Upload", "Download", "Share"].map((item) => (
            <button
              key={item}
              className={
                filter === item ? "btn btn-primary" : "btn btn-outline-primary"
              }
              onClick={() => {
                setFilter(item);
                setCurrentPage(1);
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search file..."
          className="form-control"
          style={{ width: "220px" }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* TIMELINE */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        {Object.keys(groupedActivities).map((date, index) => (
          <div key={index} style={{ marginBottom: "25px" }}>
            <h6
              style={{
                fontWeight: "600",
                color: "#6c757d",
                marginBottom: "15px",
              }}
            >
              {date}
            </h6>

            {groupedActivities[date].map((activity, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "15px 0",
                  borderBottom: "1px solid #f1f1f1",
                }}
              >
                <div style={{ fontSize: "20px", marginRight: "15px" }}>
                  {activity.action === "UPLOAD" && "📤"}
                  {activity.action === "DOWNLOAD" && "📥"}
                  {activity.action === "SHARE" && "🔗"}
                  {activity.action === "DELETE" && "🗑"}
                </div>

                <div style={{ flex: 1 }}>
                  <strong>{activity.action}</strong> — {activity.file_name}
                  <div style={{ fontSize: "13px", color: "#6c757d" }}>
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* PAGINATION */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            gap: "10px",
          }}
        >
          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          <span style={{ padding: "8px 15px" }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Activity;
