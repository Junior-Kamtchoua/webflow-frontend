import { useState, useEffect } from "react";
import api from "../../services/api";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 6;

  // 🔄 Charger favoris depuis API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get("favorites/");
        setFavorites(res.data);
      } catch (error) {
        console.error("Erreur chargement favoris:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // 📊 Stats
  const total = favorites.length;

  const images = favorites.filter((f) =>
    f.file_name.toLowerCase().match(/\.(png|jpg|jpeg|gif)$/),
  ).length;

  const documents = total - images;

  // 🔍 Filter + Search
  const filteredFiles = favorites.filter((fav) => {
    const fileName = fav.file_name.toLowerCase();

    const matchesSearch = fileName.includes(search.toLowerCase());

    let matchesFilter = true;

    if (filter === "Image") {
      matchesFilter = fileName.match(/\.(png|jpg|jpeg|gif)$/);
    } else if (filter === "PDF") {
      matchesFilter = fileName.endsWith(".pdf");
    } else if (filter === "Document") {
      matchesFilter =
        fileName.endsWith(".docx") ||
        fileName.endsWith(".xlsx") ||
        fileName.endsWith(".txt");
    }

    return matchesSearch && matchesFilter;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFiles = filteredFiles.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (loading) {
    return <div>Loading favorites...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
        Favorite Files
      </h2>

      {/* STATS */}
      <div className="row g-4" style={{ marginBottom: "30px" }}>
        <div className="col-md-4">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Total Favorites</p>
            <h3>{total}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Images</p>
            <h3 style={{ color: "#0d6efd" }}>{images}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card text-center">
            <p style={{ color: "#6c757d" }}>Documents</p>
            <h3 style={{ color: "#198754" }}>{documents}</h3>
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
          {["All", "Image", "PDF", "Document"].map((item) => (
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
          placeholder="Search favorite..."
          className="form-control"
          style={{ width: "220px" }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* GRID */}
      <div className="row g-4">
        {currentFiles.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          currentFiles.map((fav) => (
            <div key={fav.id} className="col-md-4">
              <div className="dashboard-card">
                <div style={{ fontSize: "30px" }}>⭐</div>

                <p style={{ marginTop: "15px", fontWeight: "500" }}>
                  {fav.file_name}
                </p>

                <span className="badge bg-secondary">
                  {(fav.file_size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
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
      )}
    </div>
  );
}

export default Favorites;
