function ForgotPassword() {
  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        className="form-control mb-3"
      />

      <button className="btn btn-primary w-100">Send Reset Link</button>
    </div>
  );
}

export default ForgotPassword;
