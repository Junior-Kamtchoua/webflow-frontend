import { NavLink } from "react-router-dom";

function Sidebar({ menu, title }) {
  return (
    <div className="sidebar">
      {/* LOGO */}
      <div className="mb-4">
        <h4 style={{ fontWeight: "700", color: "#1e66f5" }}>
          Workflow File Management
        </h4>
        <small className="text-muted">{title}</small>
      </div>

      <hr />

      {/* MENU */}
      {menu.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{item.label}</span>

          {item.badge && <span className="badge bg-danger">{item.badge}</span>}
        </NavLink>
      ))}
    </div>
  );
}

export default Sidebar;
