import { useState, useEffect, useRef, useMemo } from "react";
import api from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function MyFiles() {
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("Both");
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);
  const itemsPerPage = 5;

  // ===============================
  // LOAD DATA
  // ===============================
  const fetchAllData = async () => {
    try {
      const [filesRes, projectsRes, statsRes, favoritesRes] = await Promise.all(
        [
          api.get("files/"),
          api.get("projects/"),
          api.get("stats/user/"),
          api.get("favorites/"),
        ],
      );

      setFavorites(favoritesRes.data);

      setFiles(filesRes.data);
      setProjects(projectsRes.data);
      setStats(statsRes.data);

      if (projectsRes.data.length > 0) {
        setSelectedProject(projectsRes.data[0].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ===============================
  // REAL WEEKLY DATA
  // ===============================
  const chartData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = days.map((day) => ({
      name: day,
      uploads: 0,
    }));

    files.forEach((file) => {
      const date = new Date(file.uploaded_at);
      const dayIndex = date.getDay();
      result[dayIndex].uploads += 1;
    });

    return result;
  }, [files]);

  // ===============================
  // HELPERS
  // ===============================
  const formatSize = (bytes) => (bytes / (1024 * 1024)).toFixed(2) + " MB";

  const usageDanger = stats?.usage_percentage > 80;

  // ===============================
  // PAGINATION
  // ===============================
  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFiles = files.slice(startIndex, startIndex + itemsPerPage);

  // ===============================
  // UPLOAD
  // ===============================
  const handleUploadClick = () => {
    if (!selectedProject) {
      alert("Select a project first.");
      return;
    }
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("file", file);
    formData.append("project", selectedProject);

    try {
      await api.post("files/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        },
      });

      setUploadProgress(0);
      await fetchAllData();
    } catch {
      setUploadProgress(0);
      alert("Upload failed.");
    }
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (fileId) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      await api.delete(`files/${fileId}/`);
      await fetchAllData();
    } catch {
      alert("Delete failed.");
    }
  };

  const isFavorite = (fileId) => {
    return favorites.find((fav) => fav.file === fileId);
  };

  const toggleFavorite = async (fileId) => {
    const existing = isFavorite(fileId);

    try {
      if (existing) {
        await api.delete(`favorites/${existing.id}/`);
      } else {
        await api.post("favorites/", { file: fileId });
      }

      await fetchAllData();
    } catch {
      alert("Favorite action failed.");
    }
  };

  // ===============================
  // DOWNLOAD
  // ===============================
  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await api.get(`files/${fileId}/download/`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Download failed.");
    }
  };

  // ===============================
  // SHARE
  // ===============================
  const handleShare = (fileId) => {
    setSelectedFileId(fileId);
    setShowShareModal(true);
  };

  const submitShare = async () => {
    if (!shareEmail) {
      alert("Enter email.");
      return;
    }

    try {
      await api.post("share-file/", {
        file_id: selectedFileId,
        email: shareEmail,
      });

      alert("File shared successfully.");
      setShowShareModal(false);
      setShareEmail("");
    } catch {
      alert("Share failed.");
    }
  };

  if (loading || !stats) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
        My Files Overview
      </h2>

      {/* ALERT */}
      {usageDanger && (
        <div className="alert alert-danger">
          ⚠️ Storage exceeds 80%. Free some space.
        </div>
      )}

      {/* DASHBOARD CARDS */}
      <div className="row g-4">
        <div className="col-md-3">
          <div className="dashboard-card">
            <div style={{ fontSize: "28px" }}>📁</div>
            <p>Total Files</p>
            <h2>{stats.total_files}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card">
            <div style={{ fontSize: "28px" }}>💾</div>
            <p>Storage Used</p>
            <h6>
              {formatSize(stats.storage_used)} /{" "}
              {formatSize(stats.storage_quota)}
            </h6>
            <small>{stats.usage_percentage}% used</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card">
            <div style={{ fontSize: "28px" }}>📊</div>
            <p>Usage Level</p>
            <div className="progress" style={{ height: "10px" }}>
              <div
                className={`progress-bar ${
                  usageDanger ? "bg-danger" : "bg-primary"
                }`}
                style={{
                  width: `${stats.usage_percentage}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card">
            <div style={{ fontSize: "28px" }}>📂</div>
            <p>Projects</p>
            <h2>{projects.length}</h2>
          </div>
        </div>
      </div>

      {/* PREMIUM CHART */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          marginTop: "40px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
        }}
      >
        <div className="d-flex justify-content-between mb-3">
          <h5>Weekly Upload Activity</h5>

          <div>
            <button
              className={
                viewMode === "Uploads"
                  ? "btn btn-primary me-2"
                  : "btn btn-outline-primary me-2"
              }
              onClick={() => setViewMode("Uploads")}
            >
              Uploads
            </button>
            {uploadProgress > 0 && (
              <div className="progress mt-2" style={{ height: "8px" }}>
                <div
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            <button
              className={
                viewMode === "Both"
                  ? "btn btn-primary"
                  : "btn btn-outline-primary"
              }
              onClick={() => setViewMode("Both")}
            >
              Both
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="uploads"
              stroke="#0d6efd"
              strokeWidth={3}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* FILE TABLE */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          marginTop: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        <div className="d-flex justify-content-between mb-3">
          <h5>Recent Files</h5>

          <div style={{ display: "flex", gap: "10px" }}>
            <select
              className="form-select"
              style={{ width: "200px" }}
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={handleUploadClick}>
              + Upload
            </button>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>

        <table className="table align-middle">
          <thead>
            <tr>
              <th>File</th>
              <th>Size</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentFiles.map((file) => (
              <tr key={file.id}>
                <td>{file.name}</td>
                <td>{formatSize(file.size)}</td>
                <td>{new Date(file.uploaded_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className={`btn btn-sm me-2 ${
                      isFavorite(file.id)
                        ? "btn-warning"
                        : "btn-outline-warning"
                    }`}
                    onClick={() => toggleFavorite(file.id)}
                  >
                    ⭐
                  </button>

                  <button
                    className="btn btn-sm btn-outline-success me-2"
                    onClick={() => handleDownload(file.id, file.name)}
                  >
                    Download
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleShare(file.id)}
                  >
                    Share
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(file.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center mt-3">
          <button
            className="btn btn-outline-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          Page {currentPage} of {totalPages || 1}
          <button
            className="btn btn-outline-secondary ms-2"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {showShareModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Share File</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowShareModal(false)}
                />
              </div>

              <div className="modal-body">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter user email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowShareModal(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-primary" onClick={submitShare}>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyFiles;
