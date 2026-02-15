import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../../services/api";

function StorageControl() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newQuota, setNewQuota] = useState("");

  const [totalQuota, setTotalQuota] = useState(0);
  const [totalUsed, setTotalUsed] = useState(0);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [usagePercent, setUsagePercent] = useState(0);

  const itemsPerPage = 4;

  // ==========================================
  // FETCH REAL STORAGE DATA
  // ==========================================
  const fetchStorage = async () => {
    try {
      const res = await api.get("admin/storage/");
      const data = res.data;

      const convertToGB = (bytes) => (bytes / (1024 * 1024 * 1024)).toFixed(1);

      setTotalQuota(convertToGB(data.total_storage));
      setTotalUsed(convertToGB(data.total_used));
      setTotalAvailable(convertToGB(data.available));
      setUsagePercent(data.usage_percentage);

      const formattedUsers = data.users.map((u) => ({
        id: u.id,
        name: u.username,
        used: convertToGB(u.storage_used),
        quota: convertToGB(u.storage_quota),
        usage_percentage: u.usage_percentage,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching storage data", error);
    }
  };

  // ==========================================
  // LOAD DATA ON MOUNT
  // ==========================================
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const res = await api.get("admin/storage/");
        if (!isMounted) return;

        const data = res.data;

        const convertToGB = (bytes) =>
          (bytes / (1024 * 1024 * 1024)).toFixed(1);

        setTotalQuota(convertToGB(data.total_storage));
        setTotalUsed(convertToGB(data.total_used));
        setTotalAvailable(convertToGB(data.available));
        setUsagePercent(data.usage_percentage);

        const formattedUsers = data.users.map((u) => ({
          id: u.id,
          name: u.username,
          used: convertToGB(u.storage_used),
          quota: convertToGB(u.storage_quota),
          usage_percentage: u.usage_percentage,
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching storage data", error);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ==========================================
  // PAGINATION
  // ==========================================
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // ==========================================
  // UPDATE QUOTA (REAL PATCH)
  // ==========================================
  const handleUpdateQuota = async () => {
    try {
      const newQuotaBytes = Number(newQuota) * 1024 * 1024 * 1024;

      await api.patch(`users/${selectedUser.id}/`, {
        storage_quota: newQuotaBytes,
      });

      setShowModal(false);
      fetchStorage(); // refresh data
    } catch (error) {
      console.error("Error updating quota", error);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
        Storage Control
      </h2>

      {/* GLOBAL STATS */}
      <div className="row g-4" style={{ marginBottom: "30px" }}>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Total Storage</p>
            <h3>{totalQuota} GB</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Used</p>
            <h3>{totalUsed} GB</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Available</p>
            <h3>{totalAvailable} GB</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Usage</p>
            <h3>{usagePercent}%</h3>
          </div>
        </div>
      </div>

      {/* GLOBAL PROGRESS BAR */}
      <div className="dashboard-card" style={{ marginBottom: "30px" }}>
        <h5 style={{ marginBottom: "15px" }}>Global Storage Usage</h5>

        <div
          style={{
            background: "#e9ecef",
            height: "12px",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${usagePercent}%`,
              background: usagePercent > 85 ? "#dc3545" : "#0d6efd",
              height: "100%",
              transition: "width 1s ease",
            }}
          />
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search user..."
          className="form-control"
          style={{ width: "250px" }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* USERS TABLE */}
      <div className="dashboard-card">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>User</th>
              <th>Used</th>
              <th>Quota</th>
              <th>Usage</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user) => {
              const percent = user.usage_percentage;

              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.used} GB</td>
                  <td>{user.quota} GB</td>

                  <td style={{ width: "250px" }}>
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
                          width: `${percent}%`,
                          background:
                            percent >= 100
                              ? "#dc3545"
                              : percent > 80
                                ? "#ffc107"
                                : "#0d6efd",
                          height: "100%",
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                    <small>{percent}%</small>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setSelectedUser(user);
                        setNewQuota(user.quota);
                        setShowModal(true);
                      }}
                    >
                      Edit Quota
                    </button>
                  </td>
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

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Quota – {selectedUser?.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>New Quota (GB)</Form.Label>
              <Form.Control
                type="number"
                value={newQuota}
                onChange={(e) => setNewQuota(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateQuota}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default StorageControl;
