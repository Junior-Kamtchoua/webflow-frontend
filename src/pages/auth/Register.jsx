import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import api from "../../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("register/", {
        username,
        email,
        password,
      });

      // Si succès → redirection login
      navigate("/login");
    } catch (err) {
      console.error(err);

      if (err.response?.data?.email) {
        setError(err.response.data.email[0]);
      } else {
        setError("Registration failed.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="text-end mb-3">
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          Home
        </Link>
      </div>

      <h2 className="mb-4 fw-bold">Create Account</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-3">
          Register
        </button>
      </form>

      <hr />

      <div className="text-center">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </AuthLayout>
  );
}

export default Register;
