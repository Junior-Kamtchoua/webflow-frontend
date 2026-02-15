import DashboardLayout from "./DashboardLayout";
import Sidebar from "../components/Sidebar";

function ManagerLayout() {
  const menu = [
    { label: "Dashboard", path: "/dashboard/manager" },
    { label: "Team Overview", path: "/dashboard/manager/team" },
    { label: "Projects", path: "/dashboard/manager/projects" },
    { label: "Reports", path: "/dashboard/manager/reports" },
    { label: "Activity Logs", path: "/dashboard/manager/activity-logs" },
  ];

  return (
    <DashboardLayout
      sidebar={<Sidebar menu={menu} title="Manager Panel" />}
      role="Manager"
    />
  );
}

export default ManagerLayout;
