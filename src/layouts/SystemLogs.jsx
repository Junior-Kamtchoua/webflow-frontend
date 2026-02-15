import { useState } from "react";

function SystemLogs() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const logs = [
    {
      id: 1,
      level: "Info",
      user: "Sarah L",
      ip: "192.168.1.10",
      message: "User logged in successfully",
      time: "2 min ago",
    },
    {
      id: 2,
      level: "Warning",
      user: "Mark T",
      ip: "192.168.1.22",
      message: "Multiple failed login attempts",
      time: "10 min ago",
    },
    {
      id: 3,
      level: "Critical",
      user: "Unknown",
      ip: "103.44.21.3",
      message: "Unauthorized access attempt detected",
      time: "30 min ago",
    },
    {
      id: 4,
      level: "Info",
      user: "Lucas M",
      ip: "192.168.1.15",
      message: "Password changed successfully",
      time: "1 hour ago",
    },
    {
      id: 5,
      level: "Warning",
      user: "System",
      ip: "Internal",
      message: "Storage usage reached 85%",
      time: "2 hours ago",
    },
    {
      id: 6,
      level: "Critical",
      user: "System",
      ip: "Internal",
      message: "Database connection lost",
      time: "3 hours ago",
    },
  ];

  // ======================
  // STATS
  // ======================

  const total = logs.length;
  const critical = logs.filter((l) => l.level === "Critical").length;
  const warning = logs.filter((l) => l.level === "Warning").length;
  const info = logs.filter((l) => l.level === "Info").length;

  // ======================
  // FILTER + SEARCH
  // ======================

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === "All" || log.level === filter;

    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.ip.toLowerCase().includes(search.toLowerCase());

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
          placeholder="Search by user, IP, message..."
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
              <th>IP</th>
              <th>Message</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {currentLogs.map((log) => (
              <tr
                key={log.id}
                style={{ transition: "0.2s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                <td>
                  {getIcon(log.level)}{" "}
                  <span className={getBadgeClass(log.level)}>{log.level}</span>
                </td>
                <td>{log.user}</td>
                <td>{log.ip}</td>
                <td>{log.message}</td>
                <td>{log.time}</td>
              </tr>
            ))}
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
