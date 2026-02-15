import { Outlet } from "react-router-dom";
import "../styles.css";
import Topbar from "../components/Topbar";

function DashboardLayout({ sidebar, role }) {
  return (
    <div className="dashboard-container">
      {sidebar}

      <div className="dashboard-content">
        <Topbar role={role} />
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
