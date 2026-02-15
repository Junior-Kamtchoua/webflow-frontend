import { useEffect, useState, useMemo } from "react";
import api from "../../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    progress: 0,
  });

  const itemsPerPage = 4;

  // ============================
  // FETCH PROJECTS (GET)
  // ============================
  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      try {
        const res = await api.get("projects/");
        if (mounted) {
          setProjects(res.data);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================
  // CREATE PROJECT (POST)
  // ============================
  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("projects/", {
        ...newProject,
        status: "ACTIVE",
      });

      setProjects((prev) => [...prev, res.data]);

      setNewProject({
        name: "",
        description: "",
        progress: 0,
      });

      setShowForm(false);
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  const updateProgress = async (projectId, newProgress) => {
    try {
      const res = await api.patch(`projects/${projectId}/`, {
        progress: newProgress,
      });

      setProjects((prev) =>
        prev.map((project) => (project.id === projectId ? res.data : project)),
      );
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  // ============================
  // FILTER + SEARCH (Memoized)
  // ============================
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter =
        filter === "All" || project.status === filter.toUpperCase();

      const matchesSearch = project.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, search]);

  // ============================
  // PAGINATION
  // ============================
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // ============================
  // STATS
  // ============================
  const total = projects.length;
  const active = projects.filter((p) => p.status === "ACTIVE").length;
  const completed = projects.filter((p) => p.status === "COMPLETED").length;
  const archived = projects.filter((p) => p.status === "ARCHIVED").length;

  return (
    <div>
      <h2 className="mb-4 fw-bold">Projects Management</h2>

      {/* CREATE BUTTON */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        + Create Project
      </button>

      {/* CREATE FORM */}
      {showForm && (
        <form onSubmit={handleCreateProject} className="mb-4">
          <input
            className="form-control mb-2"
            placeholder="Project name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
            required
          />

          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
          />

          <button type="submit" className="btn btn-success">
            Save Project
          </button>
        </form>
      )}

      {/* STATS */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Total</p>
            <h3>{total}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Active</p>
            <h3>{active}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Completed</p>
            <h3>{completed}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Archived</p>
            <h3>{archived}</h3>
          </div>
        </div>
      </div>

      {/* FILTER + SEARCH */}
      <div className="d-flex gap-2 mb-3">
        {["All", "Active", "Completed", "Archived"].map((item) => (
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

        <input
          type="text"
          placeholder="Search project..."
          className="form-control"
          style={{ width: "220px" }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* PROJECT CARDS */}
      <div className="row g-4">
        {currentProjects.map((project) => (
          <div key={project.id} className="col-md-6">
            <div className="dashboard-card">
              <div className="d-flex justify-content-between">
                <h5>{project.name}</h5>
                <span className="badge bg-primary">{project.status}</span>
              </div>

              <p>{project.description}</p>

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
                    width: `${project.progress}%`,
                    background:
                      project.progress === 100 ? "#198754" : "#0d6efd",
                    height: "100%",
                  }}
                />
              </div>

              <div className="mt-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={project.progress}
                  className="form-range"
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setProjects((prev) =>
                      prev.map((p) =>
                        p.id === project.id ? { ...p, progress: value } : p,
                      ),
                    );
                  }}
                />

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <small>{project.progress}% complete</small>

                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => updateProgress(project.id, project.progress)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4 gap-3">
          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          <span>
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
      )}
    </div>
  );
}

export default Projects;
