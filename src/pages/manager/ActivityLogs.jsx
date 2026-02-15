import { useState, useEffect } from "react";
import api from "../../services/api";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = 6;

  // ===============================
  // 📡 FETCH REAL DATA
  // ===============================
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("manager/activity-logs/");
        setLogs(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load activity logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // ===============================
  // 📊 STATS (REAL)
  // ===============================
  const total = logs.length;
  const success = logs.filter((l) => l.log_type === "SUCCESS").length;
  const warning = logs.filter((l) => l.log_type === "WARNING").length;
  const errorCount = logs.filter((l) => l.log_type === "ERROR").length;

  // ===============================
  // 🔍 FILTER + SEARCH
  // ===============================
  const filteredLogs = logs.filter((log) => {
    const matchesFilter =
      filter === "All" || log.log_type === filter.toUpperCase();

    const matchesSearch = log.user_username
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // ===============================
  // 📄 PAGINATION
  // ===============================
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  // ===============================
  // ⏳ FORMAT DATE
  // ===============================
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // ===============================
  // UI
  // ===============================
  if (loading) return <p>Loading logs...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
        Activity Logs (Audit Trail)
      </h2>

      {/* STATS */}
      <div className="row g-4" style={{ marginBottom: "30px" }}>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Total Logs</p>
            <h3>{total}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Success</p>
            <h3 style={{ color: "#198754" }}>{success}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Warning</p>
            <h3 style={{ color: "#ffc107" }}>{warning}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Error</p>
            <h3 style={{ color: "#dc3545" }}>{errorCount}</h3>
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
          {["All", "SUCCESS", "WARNING", "ERROR"].map((item) => (
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
          placeholder="Search user..."
          className="form-control"
          style={{ width: "220px" }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        <table className="table align-middle">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Type</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {currentLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.user_username}</td>
                <td>{log.action}</td>
                <td>
                  <span
                    className={
                      log.log_type === "SUCCESS"
                        ? "badge bg-success"
                        : log.log_type === "WARNING"
                          ? "badge bg-warning text-dark"
                          : "badge bg-danger"
                    }
                  >
                    {log.log_type}
                  </span>
                </td>
                <td>{formatDate(log.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>

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
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;
