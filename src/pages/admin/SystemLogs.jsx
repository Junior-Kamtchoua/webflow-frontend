import { useState, useEffect } from "react";
import api from "../../services/api";

function SystemLogs() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    warning: 0,
    error: 0,
  });

  const itemsPerPage = 6;

  // ======================
  // FETCH REAL DATA
  // ======================
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("admin/system-logs/");
        setLogs(res.data.logs);
        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    fetchLogs();
  }, []);

  // ======================
  // MAP BACKEND LEVELS → UI LEVELS
  // ======================
  const mapLevel = (level) => {
    if (level === "ERROR") return "Critical";
    if (level === "WARNING") return "Warning";
    return "Info";
  };

  // ======================
  // STATS (FROM BACKEND)
  // ======================

  const total = stats.total;
  const critical = stats.error;
  const warning = stats.warning;
  const info = stats.success;

  // ======================
  // FILTER + SEARCH
  // ======================

  const filteredLogs = logs.filter((log) => {
    const uiLevel = mapLevel(log.level);

    const matchesFilter = filter === "All" || uiLevel === filter;

    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.message.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // ======================
  // PAGINATION
  // ======================

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const getBadgeClass = (level) => {
    switch (level) {
      case "Critical":
        return "badge bg-danger";
      case "Warning":
        return "badge bg-warning text-dark";
      default:
        return "badge bg-success";
    }
  };

  const getIcon = (level) => {
    switch (level) {
      case "Critical":
        return "🔴";
      case "Warning":
        return "🟡";
      default:
        return "🟢";
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
        System Logs – Security Monitoring
      </h2>

      {/* STATS */}
      <div className="row g-4" style={{ marginBottom: "30px" }}>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Total Logs</p>
            <h3>{total}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Critical</p>
            <h3 style={{ color: "#dc3545" }}>{critical}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Warnings</p>
            <h3 style={{ color: "#ffc107" }}>{warning}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Info</p>
            <h3 style={{ color: "#198754" }}>{info}</h3>
          </div>
        </div>
      </div>

      {/* FILTER + SEARCH */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          {["All", "Info", "Warning", "Critical"].map((item) => (
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
          placeholder="Search by user or message..."
          className="form-control"
          style={{ width: "300px" }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* TABLE */}
      <div className="dashboard-card">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Level</th>
              <th>User</th>
              <th>Message</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {currentLogs.map((log) => {
              const uiLevel = mapLevel(log.level);

              return (
                <tr key={log.id}>
                  <td>
                    {getIcon(uiLevel)}{" "}
                    <span className={getBadgeClass(uiLevel)}>{uiLevel}</span>
                  </td>
                  <td>{log.user}</td>
                  <td>{log.message}</td>
                  <td>{formatTime(log.timestamp)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            className="btn btn-outline-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

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

export default SystemLogs;
