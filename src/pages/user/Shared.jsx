import { useState, useEffect } from "react";
import api from "../../services/api";

function Shared() {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 4;

  // 🔁 Fetch API
  useEffect(() => {
    const fetchSharedFiles = async () => {
      try {
        const res = await api.get("shared-with-me/");
        setSharedFiles(res.data);
      } catch (err) {
        console.error("Error fetching shared files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedFiles();
  }, []);

  // 📊 Stats dynamiques
  const total = sharedFiles.length;
  const accepted = sharedFiles.filter((f) => f.status === "ACCEPTED").length;
  const pending = sharedFiles.filter((f) => f.status === "PENDING").length;

  // 🔍 Filter + Search
  const filteredFiles = sharedFiles.filter((file) => {
    const matchesFilter =
      filter === "All" || file.status === filter.toUpperCase();

    const matchesSearch = file.file_name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFiles = filteredFiles.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (loading) {
    return <p>Loading shared files...</p>;
  }

  const updateStatus = async (shareId, status) => {
    try {
      await api.patch(`share/${shareId}/`, { status });

      // Mettre à jour localement sans reload
      setSharedFiles((prev) =>
        prev.map((file) => (file.id === shareId ? { ...file, status } : file)),
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
        Shared With Me
      </h2>

      {/* STATS */}
      <div className="row g-4" style={{ marginBottom: "30px" }}>
        <div className="col-md-4">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Total Files</p>
            <h3>{total}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Accepted</p>
            <h3 style={{ color: "#198754" }}>{accepted}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Pending</p>
            <h3 style={{ color: "#dc3545" }}>{pending}</h3>
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
          {["All", "Accepted", "Pending"].map((item) => (
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
              <th>File Name</th>
              <th>Owner</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {currentFiles.map((file) => (
              <tr key={file.id}>
                <td>{file.file_name}</td>
                <td>{file.owner}</td>
                <td>{new Date(file.created_at).toLocaleDateString()}</td>
                <td>
                  {file.status === "PENDING" ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => updateStatus(file.id, "ACCEPTED")}
                      >
                        Accept
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateStatus(file.id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={
                        file.status === "ACCEPTED"
                          ? "badge bg-success"
                          : "badge bg-secondary"
                      }
                    >
                      {file.status}
                    </span>
                  )}
                </td>
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

export default Shared;
