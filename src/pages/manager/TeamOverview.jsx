import { useState, useEffect } from "react";
import api from "../../services/api";

function TeamOverview() {
  const [memberFilter, setMemberFilter] = useState("All");
  const [fileSearch, setFileSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [members, setMembers] = useState([]);
  const [files, setFiles] = useState([]);

  const itemsPerPage = 4;

  // =============================
  // FETCH REAL DATA
  // =============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("manager/team-overview/");
        setMembers(res.data.members);
        setFiles(res.data.files);
      } catch (err) {
        console.error("Error loading team overview", err);
      }
    };

    fetchData();
  }, []);

  // =============================
  // MEMBERS FILTER
  // =============================
  const filteredMembers =
    memberFilter === "All"
      ? members
      : members.filter((m) =>
          memberFilter === "Active" ? m.files_count > 0 : m.files_count === 0,
        );

  // =============================
  // FILE SEARCH
  // =============================
  const searchedFiles = files.filter((file) =>
    file.name.toLowerCase().includes(fileSearch.toLowerCase()),
  );

  const totalPages = Math.ceil(searchedFiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFiles = searchedFiles.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Convert bytes to MB
  const formatSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>Team Overview</h2>

      {/* ================= MEMBERS SECTION ================= */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h5 style={{ fontWeight: "600", margin: 0 }}>Team Members</h5>

          <div style={{ display: "flex", gap: "10px" }}>
            {["All", "Active", "Offline"].map((item) => (
              <button
                key={item}
                className={
                  memberFilter === item
                    ? "btn btn-primary"
                    : "btn btn-outline-primary"
                }
                onClick={() => setMemberFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="row g-4">
          {filteredMembers.map((member) => (
            <div key={member.id} className="col-md-3">
              <div className="dashboard-card text-center">
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "#0d6efd",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 15px",
                    fontSize: "22px",
                    fontWeight: "600",
                  }}
                >
                  {member.username.charAt(0).toUpperCase()}
                </div>

                <h6 style={{ marginBottom: "5px" }}>{member.username}</h6>
                <small style={{ color: "#6c757d" }}>{member.role}</small>

                <div style={{ marginTop: "10px" }}>
                  <span
                    className={
                      member.files_count > 0
                        ? "badge bg-success"
                        : "badge bg-secondary"
                    }
                  >
                    {member.files_count > 0 ? "Active" : "Offline"}
                  </span>
                </div>

                {/* PERFORMANCE BAR */}
                <div style={{ marginTop: "15px" }}>
                  <div
                    style={{
                      background: "#e9ecef",
                      height: "8px",
                      borderRadius: "20px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${member.performance}%`,
                        background:
                          member.performance > 85
                            ? "#198754"
                            : member.performance > 75
                              ? "#0d6efd"
                              : "#ffc107",
                        height: "100%",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                  <small>{member.performance}% performance</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= TEAM FILES SECTION ================= */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h5 style={{ fontWeight: "600", margin: 0 }}>Team Files</h5>

          <input
            type="text"
            placeholder="Search file..."
            className="form-control"
            style={{ width: "220px" }}
            value={fileSearch}
            onChange={(e) => {
              setFileSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <table className="table align-middle">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Owner</th>
              <th>Size</th>
            </tr>
          </thead>

          <tbody>
            {currentFiles.map((file) => (
              <tr key={file.id}>
                <td>{file.name}</td>
                <td>{file.owner}</td>
                <td>{formatSize(file.size)}</td>
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

export default TeamOverview;
