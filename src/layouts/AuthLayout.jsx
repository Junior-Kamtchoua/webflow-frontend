import "../styles.css";

function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      {/* LEFT SIDE */}
      <div className="auth-left">
        <div>
          <h1 style={{ fontSize: "42px", fontWeight: "700" }}>FileFlow</h1>
          <p style={{ marginTop: "20px", fontSize: "18px" }}>
            Advanced File Management Platform
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="auth-form bg-white p-5 rounded-4 shadow">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
