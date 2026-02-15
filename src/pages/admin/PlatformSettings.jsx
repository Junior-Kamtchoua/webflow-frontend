import { useState } from "react";

function PlatformSettings() {
  const [settings, setSettings] = useState({
    platformName: "My SaaS Platform",
    supportEmail: "support@mysaas.com",
    maintenanceMode: false,
    enable2FA: true,
    passwordPolicy: true,
    emailNotifications: true,
  });

  const [logoPreview, setLogoPreview] = useState(null);

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleInputChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
        Platform Settings
      </h2>

      {/* GENERAL SETTINGS */}
      <div className="dashboard-card" style={{ marginBottom: "30px" }}>
        <h5 style={{ marginBottom: "20px" }}>General Settings</h5>

        <div className="mb-3">
          <label className="form-label">Platform Name</label>
          <input
            type="text"
            className="form-control"
            name="platformName"
            value={settings.platformName}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Support Email</label>
          <input
            type="email"
            className="form-control"
            name="supportEmail"
            value={settings.supportEmail}
            onChange={handleInputChange}
          />
        </div>

        {/* LOGO UPLOAD */}
        <div className="mb-3">
          <label className="form-label">Upload Logo</label>
          <input
            type="file"
            className="form-control"
            onChange={handleLogoUpload}
          />

          {logoPreview && (
            <div style={{ marginTop: "15px" }}>
              <img
                src={logoPreview}
                alt="Logo Preview"
                style={{
                  width: "120px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* SECURITY SETTINGS */}
      <div className="dashboard-card" style={{ marginBottom: "30px" }}>
        <h5 style={{ marginBottom: "20px" }}>Security Settings</h5>

        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={settings.enable2FA}
            onChange={() => handleToggle("enable2FA")}
          />
          <label className="form-check-label">
            Enable Two-Factor Authentication (2FA)
          </label>
        </div>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            checked={settings.passwordPolicy}
            onChange={() => handleToggle("passwordPolicy")}
          />
          <label className="form-check-label">
            Enforce Strong Password Policy
          </label>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="dashboard-card" style={{ marginBottom: "30px" }}>
        <h5 style={{ marginBottom: "20px" }}>Notifications</h5>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={() => handleToggle("emailNotifications")}
          />
          <label className="form-check-label">Enable Email Notifications</label>
        </div>
      </div>

      {/* MAINTENANCE MODE */}
      <div className="dashboard-card" style={{ marginBottom: "30px" }}>
        <h5 style={{ marginBottom: "20px" }}>Maintenance Mode</h5>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={() => handleToggle("maintenanceMode")}
          />
          <label className="form-check-label">Enable Maintenance Mode</label>
        </div>

        {settings.maintenanceMode && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              background: "#fff3cd",
              borderRadius: "8px",
            }}
          >
            ⚠ Platform is currently in maintenance mode.
          </div>
        )}
      </div>

      {/* SAVE BUTTON */}
      <div style={{ textAlign: "right" }}>
        <button
          className="btn btn-success"
          style={{ transition: "0.3s" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default PlatformSettings;
