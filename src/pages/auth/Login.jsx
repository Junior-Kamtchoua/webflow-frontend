import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import AuthContext from "../../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(username, password);
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
    <AuthLayout>
      <div className="text-end mb-3">
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          Home
        </Link>
      </div>

      <h2 className="mb-4 fw-bold">Welcome Back</h2>

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
          Log In
        </button>
      </form>

      <div className="text-center">
        <Link to="/forgot-password">Forgot your password?</Link>
      </div>

      <hr />

      <div className="text-center">
        Don't have an account? <Link to="/register">Sign up</Link>
      </div>
    </AuthLayout>
  );
}

export default Login;
