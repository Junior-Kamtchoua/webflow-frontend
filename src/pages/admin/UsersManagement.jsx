import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../../services/api";

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "USER",
    is_active: true,
    password: "",
  });

  // ===============================
  // FETCH USERS (DECLARED FIRST ✅)
  // ===============================
  const fetchUsers = async () => {
    try {
      const res = await api.get("users/");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // LOAD USERS
  // ===============================
  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const res = await api.get("users/");
        if (isMounted) {
          setUsers(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  // ===============================
  // STATS
  // ===============================
  const total = users.length;
  const active = users.filter((u) => u.is_active).length;
  const inactive = users.filter((u) => !u.is_active).length;
  const admins = users.filter((u) => u.role === "ADMIN").length;

  // ===============================
  // FILTER + SEARCH
  // ===============================
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRole = filterRole === "All" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // ===============================
  // SAVE USER
  // ===============================
  const handleSave = async () => {
    try {
      if (editUser) {
        await api.put(`users/${editUser.id}/`, formData);
      } else {
        await api.post("users/", formData);
      }

      fetchUsers();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({
      ...user,
      password: "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`users/${id}/`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditUser(null);
    setFormData({
      username: "",
      email: "",
      role: "USER",
      is_active: true,
      password: "",
    });
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
        Users Management
      </h2>

      {/* STATS */}
      <div className="row g-4" style={{ marginBottom: "30px" }}>
        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Total Users</p>
            <h3>{total}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Active</p>
            <h3 style={{ color: "#198754" }}>{active}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Inactive</p>
            <h3 style={{ color: "#dc3545" }}>{inactive}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card text-center">
            <p>Admins</p>
            <h3 style={{ color: "#0d6efd" }}>{admins}</h3>
          </div>
        </div>
      </div>

      {/* FILTER + SEARCH + ADD */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <select
            className="form-select"
            style={{ width: "150px" }}
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="USER">User</option>
          </select>

          <input
            type="text"
            placeholder="Search user..."
            className="form-control"
            style={{ width: "200px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add User
        </button>
      </div>

      {/* TABLE */}
      <div className="dashboard-card">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className="badge bg-primary">{user.role}</span>
                </td>
                <td>
                  <span
                    className={
                      user.is_active ? "badge bg-success" : "badge bg-danger"
                    }
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
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
          }}
        >
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
          <Modal.Title>{editUser ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>

            {!editUser && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="USER">User</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.is_active}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.value === "true",
                  })
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UsersManagement;
